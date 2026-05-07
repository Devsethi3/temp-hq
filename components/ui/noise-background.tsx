
const NoiseBackground = () => {
  return (
    <div>
      <div className="pointer-events-none inset-0 -z-10 h-full w-full">
        <div className="absolute inset-0 -z-10">
          {/* Base gradient */}
          <div className="absolute inset-0 bg-linear-to-b from-background via-background to-primary/2" />

          {/* Noise texture */}
          <div
            className="absolute inset-0 opacity-[0.35] dark:opacity-[0.09]"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
            }}
          />

          {/* <div className="absolute -top-1/4 left-1/2 aspect-square w-full max-w-3xl -translate-x-1/2 rounded-full bg-primary/5 blur-[150px]" /> */}

          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,var(--background)_80%)]" />
        </div>
      </div>
    </div>
  )
}

export default NoiseBackground
