import { cn } from "@/lib/utils"
import Image from "next/image"

type LogoProps = {
  className?: string
  showText?: boolean
}

export function Logo({ className, showText = true }: LogoProps) {
  return (
    <div className={cn("inline-flex items-center gap-2", className)}>
      <Image src={"/logo.svg"} width={30} height={30} alt="logo" />
      {showText ? (
        <span className="font-heading text-base text-foreground">
          LOGO
        </span>
      ) : null}
    </div>
  )
}
