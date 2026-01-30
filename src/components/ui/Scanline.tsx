export function Scanline() {
    return (
        <div className="fixed inset-0 z-50 pointer-events-none overflow-hidden h-full w-full">
            {/* Moving scanline */}
            <div className="absolute inset-0 bg-linear-to-b from-transparent via-cyan/10 to-transparent h-[50%] w-full animate-scanline opacity-[0.03]" />

            {/* Static noise/lines */}
            <div
                className="absolute inset-0 opacity-[0.02]"
                style={{
                    backgroundImage: "linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.25) 50%), linear-gradient(90deg, rgba(255, 0, 0, 0.06), rgba(0, 255, 0, 0.02), rgba(0, 0, 255, 0.06))",
                    backgroundSize: "100% 2px, 3px 100%"
                }}
            />
        </div>
    );
}
