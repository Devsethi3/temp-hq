import { cn } from "@/lib/utils"
import Image from "next/image"

type LogoProps = {
  className?: string
  showText?: boolean
}

export function Logo({ className, showText = true }: LogoProps) {
  return (
    <div className={cn("inline-flex items-center gap-2 pt-1", className)}>
      <Image src={"/logo.svg"} width={25} height={25} alt="logo" />
      {showText ? (
        <span className="font-heading text-lg text-foreground/80 ">
          LogoVault
        </span>
      ) : null}
    </div>
  )
}
