import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Download,
  FileText,
  Calendar as CalendarIconLucide,
  Clock,
} from "lucide-react";
import { Calendar as ShadcnCalendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import PropTypes from "prop-types";

export default function ReportGenerateForm({
  activeTab,
  setActiveTab,
  dateRange,
  selectedMonth,
  setSelectedMonth,
  selectedYear,
  setSelectedYear,
  isGenerating,
  handleGenerateReport,
  handleDateRangeChange,
}) {
  const months = [
    { value: "1", label: "January" },
    { value: "2", label: "February" },
    { value: "3", label: "March" },
    { value: "4", label: "April" },
    { value: "5", label: "May" },
    { value: "6", label: "June" },
    { value: "7", label: "July" },
    { value: "8", label: "August" },
    { value: "9", label: "September" },
    { value: "10", label: "October" },
    { value: "11", label: "November" },
    { value: "12", label: "December" },
  ];
  const years = Array.from({ length: 10 }, (_, i) => {
    const year = new Date().getFullYear() - i;
    return { value: year.toString(), label: year.toString() };
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Generate New Report
        </CardTitle>
        <CardDescription>
          Choose date range or specific month to generate Excel report
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="daterange" className="flex items-center gap-2">
              <CalendarIconLucide className="h-4 w-4" />
              Date Range
            </TabsTrigger>
            <TabsTrigger value="monthly" className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Monthly
            </TabsTrigger>
          </TabsList>

          <TabsContent value="daterange" className="space-y-4 mt-6">
            <div className="space-y-2">
              <Label>Date Range</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !dateRange.from && "text-muted-foreground"
                    )}
                  >
                    <CalendarIconLucide className="mr-2 h-4 w-4" />
                    {dateRange.from && dateRange.from instanceof Date ? (
                      dateRange.to && dateRange.to instanceof Date ? (
                        <>
                          {format(dateRange.from, "LLL dd, y")} -{" "}
                          {format(dateRange.to, "LLL dd, y")}
                        </>
                      ) : (
                        format(dateRange.from, "LLL dd, y")
                      )
                    ) : (
                      <span>Pilih rentang tanggal</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <ShadcnCalendar
                    key="date-range-calendar"
                    initialFocus
                    mode="range"
                    defaultMonth={
                      dateRange?.from && dateRange.from instanceof Date
                        ? dateRange.from
                        : new Date()
                    }
                    selected={dateRange}
                    onSelect={handleDateRangeChange}
                    numberOfMonths={2}
                    className="rounded-md border"
                  />
                </PopoverContent>
              </Popover>
            </div>
          </TabsContent>

          <TabsContent value="monthly" className="space-y-4 mt-6">
            <div className="flex gap-2">
              <div className="">
                <Label htmlFor="month">Month</Label>
                <Select value={selectedMonth} onValueChange={setSelectedMonth}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select month" />
                  </SelectTrigger>
                  <SelectContent>
                    {months.map((month) => (
                      <SelectItem key={month.value} value={month.value}>
                        {month.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="">
                <Label htmlFor="year">Year</Label>
                <Select value={selectedYear} onValueChange={setSelectedYear}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select year" />
                  </SelectTrigger>
                  <SelectContent>
                    {years.map((year) => (
                      <SelectItem key={year.value} value={year.value}>
                        {year.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <div className="flex justify-end mt-6">
          <Button
            onClick={handleGenerateReport}
            disabled={isGenerating}
            className="w-full"
          >
            {isGenerating ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                Generating...
              </>
            ) : (
              <>
                <Download className="h-4 w-4 mr-2" />
                Generate Report
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

ReportGenerateForm.propTypes = {
  activeTab: PropTypes.string.isRequired,
  setActiveTab: PropTypes.func.isRequired,
  dateRange: PropTypes.shape({
    from: PropTypes.instanceOf(Date),
    to: PropTypes.instanceOf(Date),
  }).isRequired,
  setDateRange: PropTypes.func,
  selectedMonth: PropTypes.string.isRequired,
  setSelectedMonth: PropTypes.func.isRequired,
  selectedYear: PropTypes.string.isRequired,
  setSelectedYear: PropTypes.func.isRequired,
  isGenerating: PropTypes.bool.isRequired,
  handleGenerateReport: PropTypes.func.isRequired,
  handleDateRangeChange: PropTypes.func.isRequired,
};
