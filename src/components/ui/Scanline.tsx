export function Scanline() {
    return (
        <div className="fixed inset-0 z-50 pointer-events-none overflow-hidden h-full w-full">
            {/* Moving scanline — visible HUD sweep */}
            <div className="absolute inset-0 bg-linear-to-b from-transparent via-cyan/12 to-transparent h-[50%] w-full animate-scanline opacity-[0.09]" />

            {/* Static CRT noise/lines */}
            <div
                className="absolute inset-0 opacity-[0.05]"
                style={{
                    backgroundImage: "linear-gradient(rgba(6, 8, 13, 0) 50%, rgba(0, 0, 0, 0.3) 50%), linear-gradient(90deg, rgba(167, 139, 250, 0.04), rgba(16, 185, 129, 0.02), rgba(167, 139, 250, 0.04))",
                    backgroundSize: "100% 2px, 3px 100%"
                }}
            />
        </div>
    );
}
