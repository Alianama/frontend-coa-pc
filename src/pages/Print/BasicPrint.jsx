import { useReactToPrint } from "react-to-print";
import ComponentToPrint from "./Template/TampletePrint1";
import ComponentToPrintTable from "./Template/TemplatePrint2";
import { Button } from "@/components/ui/button";
import { asyncGetPrintByID } from "@/store/print/action";
import { useSelector, useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import { useCallback, useEffect, useRef, useState } from "react";
import { Printer } from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

ComponentToPrintTable.displayName = "ComponentToPrintTable";

const BasicComponent = () => {
  const [tab, setTab] = useState("template1");
  const componentRef1 = useRef(null);
  const componentRef2 = useRef(null);
  const dispatch = useDispatch();
  const { id } = useParams();
  const detail = useSelector((state) => state.prints.detail);

  const handleAfterPrint = useCallback(() => {
    console.log("`onAfterPrint` called");
  }, []);

  const handleBeforePrint = useCallback(() => {
    console.log("`onBeforePrint` called");
    return Promise.resolve();
  }, []);

  useEffect(() => {
    dispatch(asyncGetPrintByID(id));
  }, [id, dispatch]);

  // Print function untuk masing-masing tab
  const printFn1 = useReactToPrint({
    contentRef: componentRef1,
    documentTitle: "Certificate of Analysis - Template 1",
    onAfterPrint: handleAfterPrint,
    onBeforePrint: handleBeforePrint,
  });
  const printFn2 = useReactToPrint({
    contentRef: componentRef2,
    documentTitle: "Certificate of Analysis - Template 2",
    onAfterPrint: handleAfterPrint,
    onBeforePrint: handleBeforePrint,
  });

  // Event listener Ctrl+P untuk tab aktif
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "p") {
        e.preventDefault();
        if (tab === "template1") printFn1();
        else printFn2();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [printFn1, printFn2, tab]);

  return (
    <div className="p-10">
      <Tabs value={tab} onValueChange={setTab}>
        <div className="flex items-center justify-between mb-4">
          <TabsList>
            <TabsTrigger value="template1">Template 1</TabsTrigger>
            <TabsTrigger value="template2">Template 2</TabsTrigger>
          </TabsList>
          {/* Button print di kanan */}
          {tab === "template1" ? (
            <Button className="ml-5" onClick={printFn1}>
              <Printer /> Print (CTRL + P)
            </Button>
          ) : (
            <Button className="ml-5" onClick={printFn2}>
              <Printer /> Print (CTRL + P)
            </Button>
          )}
        </div>
        <TabsContent value="template1">
          {/* Template lama tetap dipakai di sini */}
          <ComponentToPrint data={detail} ref={componentRef1} />
        </TabsContent>
        <TabsContent value="template2">
          <ComponentToPrintTable data={detail} ref={componentRef2} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export { BasicComponent };
