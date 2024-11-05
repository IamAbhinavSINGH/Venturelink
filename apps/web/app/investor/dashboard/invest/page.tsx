import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import InvestPage  from "@/components/investor/InvestPage";

export default function() {
  return (
        <div className="transition-all duration-200 ease-in-out">
            <InvestPage />
        </div>
  )
}