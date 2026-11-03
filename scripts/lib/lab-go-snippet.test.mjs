import assert from "node:assert/strict";
import { execFileSync, spawnSync } from "node:child_process";
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

// Optional executable-content gate. No Go compiler is needed by the website.
// Run with PORTFOLIO_GO_BINARY=/path/to/go node --test scripts/lib/lab-go-snippet.test.mjs.
const root = resolve(dirname(fileURLToPath(import.meta.url)), "../..");
const compiler = process.env.PORTFOLIO_GO_BINARY || "go";
const version = spawnSync(compiler, ["version"], { encoding: "utf8" });
const available = version.status === 0 && /^go version go\d/.test(version.stdout);

const checks = String.raw`package main
import (
 "bytes"
 "encoding/binary"
 "image"
 "image/color"
 "image/png"
 "os"
 "os/exec"
 "path/filepath"
 "testing"
)
func readPayload(img image.Image) []byte {
 bounds:=img.Bounds()
 data:=make([]byte,bounds.Dx()*bounds.Dy()/8)
 index:=0
 for y:=bounds.Min.Y;y<bounds.Max.Y;y++ { for x:=bounds.Min.X;x<bounds.Max.X;x++ {
  if index/8>=len(data) {return data}
  pixel:=color.NRGBAModel.Convert(img.At(x,y)).(color.NRGBA)
  data[index/8]|=(pixel.R&1)<<uint(7-index%8);index++
 } }
 return data
}
func TestOversizeLeavesImageUnchanged(t *testing.T) {
 img:=image.NewNRGBA(image.Rect(0,0,2,2))
 for y:=0;y<2;y++ {for x:=0;x<2;x++ {img.SetNRGBA(x,y,color.NRGBA{R:101,A:255})}}
 before:=append([]byte(nil),img.Pix...)
 if err:=embed(img,[]byte("too large"));err==nil {t.Fatal("expected capacity error")}
 if !bytes.Equal(before,img.Pix) {t.Fatal("rejected payload partially modified image")}
}
func TestExactCapacityRoundTrip(t *testing.T) {
 payload:=[]byte("HIDDEN_MESSAGE")
 img:=image.NewNRGBA(image.Rect(4,7,12,7+4+len(payload)))
 if err:=embed(img,payload);err!=nil {t.Fatal(err)}
 result:=readPayload(img)
 if binary.BigEndian.Uint32(result[:4])!=uint32(len(payload)) || !bytes.Equal(result[4:],payload) {t.Fatalf("bad roundtrip: %v",result)}
}
func createCover(t *testing.T,dir string,size int) {
 t.Helper();f,err:=os.Create(filepath.Join(dir,"cover.png"));if err!=nil {t.Fatal(err)}
 defer f.Close()
 if err=png.Encode(f,image.NewNRGBA(image.Rect(0,0,size,size)));err!=nil {t.Fatal(err)}
}
func TestCLIRejectsInvalidInputs(t *testing.T) {
 for _,scenario:=range []string{"missing","invalid","too-small","unwritable-output"} {
  t.Run(scenario,func(t *testing.T){
   dir:=t.TempDir()
   switch scenario {
   case "invalid":if err:=os.WriteFile(filepath.Join(dir,"cover.png"),[]byte("not PNG"),0600);err!=nil {t.Fatal(err)}
   case "too-small":createCover(t,dir,2)
   case "unwritable-output":createCover(t,dir,20);if err:=os.Mkdir(filepath.Join(dir,"stego.png"),0700);err!=nil {t.Fatal(err)}
   }
   cmd:=exec.Command(os.Getenv("LAB_SAMPLE_BIN"));cmd.Dir=dir
   out,err:=cmd.CombinedOutput()
   if err==nil {t.Fatalf("must fail, instead output: %s",out)}
   if bytes.Contains(out,[]byte("Done")) {t.Fatalf("claimed success: %s",out)}
  })
 }
}
func TestCLIEmitsDecodablePayload(t *testing.T) {
 dir:=t.TempDir();createCover(t,dir,20)
 cmd:=exec.Command(os.Getenv("LAB_SAMPLE_BIN"));cmd.Dir=dir
 out,err:=cmd.CombinedOutput();if err!=nil {t.Fatalf("run: %v: %s",err,out)}
 if !bytes.Contains(out,[]byte("Done")) {t.Fatalf("missing completion: %s",out)}
 f,err:=os.Open(filepath.Join(dir,"stego.png"));if err!=nil {t.Fatal(err)};defer f.Close()
 img,err:=png.Decode(f);if err!=nil {t.Fatal(err)}
 result:=readPayload(img);length:=binary.BigEndian.Uint32(result[:4])
 if length!=14 || string(result[4:4+length])!="HIDDEN_MESSAGE" {t.Fatalf("bad payload: %v",result)}
}
`;

test("published Go snippet rejects failures and preserves a lossless payload", {
  skip: available ? false : "Optional Go compiler unavailable; set PORTFOLIO_GO_BINARY",
  timeout: 120_000,
}, () => {
  const source = readFileSync(join(root, "src/lib/data.ts"), "utf8");
  const match = source.match(/codeSnippet: `(package main\n[\s\S]*?\n})`,/);
  assert.ok(match, "Go sample must be present in the published dataset");
  const directory = mkdtempSync(join(tmpdir(), "portfolio-go-snippet-"));
  try {
    writeFileSync(join(directory, "main.go"), match[1]);
    writeFileSync(join(directory, "main_test.go"), checks);
    const binary = join(directory, "sample");
    const options = {
      cwd: directory,
      env: { ...process.env, GO111MODULE: "off", GOTOOLCHAIN: "local", GOCACHE: join(directory, "cache"), LAB_SAMPLE_BIN: binary },
      encoding: "utf8",
      timeout: 110_000,
      maxBuffer: 128 * 1024,
    };
    execFileSync(compiler, ["build", "-o", binary, "main.go"], options);
    const output = execFileSync(compiler, ["test", "-v"], options);
    assert.match(output, /PASS/);
    process.stdout.write(output);
  } finally {
    rmSync(directory, { recursive: true, force: true });
  }
});
