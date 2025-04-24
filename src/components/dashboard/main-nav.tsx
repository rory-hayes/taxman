import Link from "next/link"
import { cn } from "@/lib/utils"

export function MainNav({
  className,
  ...props
}: React.HTMLAttributes<HTMLElement>) {
  return (
    <nav
      className={cn("flex items-center space-x-6", className)}
      {...props}
    >
      <Link
        href="/dashboard"
        className="text-sm font-medium transition-colors hover:text-primary bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600"
      >
        Overview
      </Link>
      <Link
        href="/dashboard/payslips"
        className="text-sm font-medium text-muted-foreground transition-colors hover:bg-clip-text hover:text-transparent hover:bg-gradient-to-r hover:from-indigo-600 hover:to-purple-600"
      >
        Payslips
      </Link>
      <Link
        href="/dashboard/savings"
        className="text-sm font-medium text-muted-foreground transition-colors hover:bg-clip-text hover:text-transparent hover:bg-gradient-to-r hover:from-indigo-600 hover:to-purple-600"
      >
        Savings
      </Link>
      <Link
        href="/dashboard/tax"
        className="text-sm font-medium text-muted-foreground transition-colors hover:bg-clip-text hover:text-transparent hover:bg-gradient-to-r hover:from-indigo-600 hover:to-purple-600"
      >
        Tax Analysis
      </Link>
    </nav>
  )
} 