import * as React from "react"

interface TabsProps {
    defaultValue?: string
    value?: string
    onValueChange?: (value: string) => void
    className?: string
    children: React.ReactNode
}

interface TabsContextType {
    value: string
    onValueChange: (value: string) => void
}

const TabsContext = React.createContext<TabsContextType>({ value: "", onValueChange: () => { } })

export function Tabs({ defaultValue = "", value: controlledValue, onValueChange, className = "", children }: TabsProps) {
    const [internalValue, setInternalValue] = React.useState(defaultValue)
    const value = controlledValue ?? internalValue
    const handleChange = onValueChange ?? setInternalValue

    return (
        <TabsContext.Provider value={{ value, onValueChange: handleChange }}>
            <div className={className}>{children}</div>
        </TabsContext.Provider>
    )
}

export function TabsList({ className = "", children }: { className?: string; children: React.ReactNode }) {
    return (
        <div className={`inline-flex items-center gap-1 bg-secondary/50 p-1 rounded-xl ${className}`}>
            {children}
        </div>
    )
}

export function TabsTrigger({ value, className = "", children }: { value: string; className?: string; children: React.ReactNode }) {
    const ctx = React.useContext(TabsContext)
    const isActive = ctx.value === value

    return (
        <button
            onClick={() => ctx.onValueChange(value)}
            data-state={isActive ? "active" : "inactive"}
            className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-all ${isActive ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"} ${className}`}
        >
            {children}
        </button>
    )
}

export function TabsContent({ value, className = "", children }: { value: string; className?: string; children: React.ReactNode }) {
    const ctx = React.useContext(TabsContext)
    if (ctx.value !== value) return null
    return <div className={className}>{children}</div>
}
