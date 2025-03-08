"use client"

interface SetTabsProps {
    activeTab: string
    haveCount: number
    needCount: number
    dupesCount: number
    onTabChange: (tab: string) => void
}

export default function SetTabs({ activeTab, haveCount, needCount, dupesCount, onTabChange }: SetTabsProps) {
    const tabs = [
        { id: "show-all", label: "Show All" },
        { id: "have", label: `Have (${haveCount})` },
        { id: "need", label: `Need (${needCount})` },
        { id: "dupes", label: `Dupes (${dupesCount})` },
    ]

    return (
        <div className="tabs tabs-boxed bg-transparent gap-2">
            {tabs.map((tab) => (
                <button
                    key={tab.id}
                    className={`tab ${activeTab === tab.id ? "tab-active bg-primary text-primary-content" : "text-white hover:text-primary"}`}
                    onClick={() => onTabChange(tab.id)}
                >
                    {tab.label}
                </button>
            ))}
        </div>
    )
}

