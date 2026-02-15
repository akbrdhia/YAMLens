export function Editor() {
  return (
    <div className="h-full w-full flex flex-col bg-background">
      <div className="flex items-center justify-between px-4 py-2 border-b border-border">
        <span className="text-sm font-medium text-muted-foreground">
          docker-compose.yml
        </span>
      </div>
      <div className="flex-1 p-4 font-mono text-sm text-muted-foreground">
        Paste your docker-compose.yml here...
      </div>
    </div>
  )
}
