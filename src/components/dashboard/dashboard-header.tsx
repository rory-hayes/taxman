
interface DashboardHeaderProps {
  displayName: string
}

export function DashboardHeader({ displayName }: DashboardHeaderProps) {
  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Welcome back, {displayName}
        </h1>
        <p className="text-muted-foreground">
          Here's an overview of your finances
        </p>
      </div>
    </div>
  )
} 