"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Building2,
  Globe,
  Users,
  FileText,
  BanknoteIcon,
  Settings,
} from "lucide-react"
import { Separator } from "@/components/ui/separator"
import { CompanyDetailsForm } from "@/components/founder/CompanyDetailsForm"
import { TeamMembersForm } from "@/components/founder/TeamMembersForm"
import { BankingForm } from "@/components/founder/BankingForm"
import { DocumentsForm } from "@/components/founder/DocumentForm"
import { WebsiteIndustryForm } from "@/components/founder/WebsiteIndustryForm"

const sidebarNavItems = [
  {
    title: "Company Details",
    icon: Building2,
    form: CompanyDetailsForm,
  },
  {
    title: "Website & Industry",
    icon: Globe,
    form: WebsiteIndustryForm,
  },
  {
    title: "Team Members",
    icon: Users,
    form: TeamMembersForm,
  },
  {
    title: "Banking Information",
    icon: BanknoteIcon,
    form: BankingForm,
  },
  {
    title: "Legal Documents",
    icon: FileText,
    form: DocumentsForm,
  },
]

export default function SettingsPage() {
  const [activeSection, setActiveSection] = useState(sidebarNavItems[0].title)

  const ActiveForm = sidebarNavItems.find(
    (item) => item.title === activeSection
  )?.form

  return (
    <div className="container mx-auto py-6">
      <div className="flex flex-col space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0">
        <aside className="lg:w-1/5">
          <div className="flex flex-col space-y-4">
            <h2 className="text-lg font-semibold">Settings</h2>
            <nav className="flex flex-col space-y-1">
              {sidebarNavItems.map((item) => (
                <Button
                  key={item.title}
                  variant={activeSection === item.title ? "secondary" : "ghost"}
                  className={cn(
                    "justify-start",
                    activeSection === item.title &&
                      "bg-muted font-medium text-primary"
                  )}
                  onClick={() => setActiveSection(item.title)}
                >
                  <item.icon className="mr-2 h-4 w-4" />
                  {item.title}
                </Button>
              ))}
            </nav>
          </div>
        </aside>
        <div className="flex-1 lg:max-w-3xl">
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium">{activeSection}</h3>
              <p className="text-sm text-muted-foreground">
                Manage your {activeSection.toLowerCase()} settings and preferences.
              </p>
            </div>
            <Separator />
            {ActiveForm && <ActiveForm />}
          </div>
        </div>
      </div>
    </div>
  )
}