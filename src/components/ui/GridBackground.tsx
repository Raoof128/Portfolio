export function GridBackground() {
    return (
        <div className="fixed inset-0 z-[-1] pointer-events-none bg-background">
            <div className="absolute inset-0 cyber-grid" />
            <div className="absolute inset-0 bg-linear-to-b from-transparent via-transparent to-background/80" />
        </div>
    );
}
