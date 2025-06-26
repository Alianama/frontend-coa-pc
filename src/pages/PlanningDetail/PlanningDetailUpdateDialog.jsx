import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import PropTypes from "prop-types";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { toast } from "sonner";
import { asyncUpdatePlanningDetail } from "@/store/planningDetail/action";

export default function PlanningDetailUpdateDialog({
  open,
  onOpenChange,
  editingItem,
}) {
  const dispatch = useDispatch();
  const { lot } = useParams();
  const { header } = useSelector((state) => state.planningDetail);
  const customers = useSelector((state) => state.customers);

  const [formData, setFormData] = useState({
    qty: "",
    lineNo: "",
    tintDeltaL: "",
    tintDeltaA: "",
    tintDeltaB: "",
    colorDeltaL: "",
    colorDeltaA: "",
    colorDeltaB: "",
    deltaP: "",
    density: "",
    mfr: "",
    dispersibility: "",
    contamination: "",
    macaroni: "",
    pelletLength: "",
    pelletDiameter: "",
    visualCheck: "",
    colorCheck: "",
    moisture: "",
    carbonContent: "",
    foreignMatter: "",
    weightOfChips: "",
    intrinsicViscosity: "",
    ashContent: "",
    heatStability: "",
    lightFastness: "",
    granule: "",
    analysisDate: "",
    checkedBy: "",
    remark: "",
    // letDownRatio: "",
  });

  useEffect(() => {
    if (editingItem) {
      const newFormData = {
        qty: editingItem.qty || "",
        lineNo: editingItem.lineNo || "",
        tintDeltaL: editingItem.tintDeltaL || "",
        tintDeltaA: editingItem.tintDeltaA || "",
        tintDeltaB: editingItem.tintDeltaB || "",
        colorDeltaL: editingItem.colorDeltaL || "",
        colorDeltaA: editingItem.colorDeltaA || "",
        colorDeltaB: editingItem.colorDeltaB || "",
        deltaP: editingItem.deltaP || "",
        density: editingItem.density || "",
        mfr: editingItem.mfr || "",
        dispersibility: editingItem.dispersibility || "",
        contamination: editingItem.contamination || "",
        macaroni: editingItem.macaroni || "",
        pelletLength: editingItem.pelletLength || "",
        pelletDiameter: editingItem.pelletDiameter || "",
        visualCheck: editingItem.visualCheck || "",
        colorCheck: editingItem.colorCheck || "",
        moisture: editingItem.moisture || "",
        carbonContent: editingItem.carbonContent || "",
        foreignMatter: editingItem.foreignMatter || "",
        weightOfChips: editingItem.weightOfChips || "",
        intrinsicViscosity: editingItem.intrinsicViscosity || "",
        ashContent: editingItem.ashContent || "",
        heatStability: editingItem.heatStability || "",
        lightFastness: editingItem.lightFastness || "",
        granule: editingItem.granule || "",
        analysisDate: editingItem.analysisDate
          ? new Date(editingItem.analysisDate).toISOString().slice(0, 16)
          : "",
        checkedBy: editingItem.checkedBy || "",
        remark: editingItem.remark || "",
        // letDownRatio: editingItem.letDownRatio || "",
      };

      // Cek jika customer punya mandatoryFields dan ada letDownRatio
      if (header && customers && customers.length > 0 && header.idCustomer) {
        const selectedCustomer = customers.find(
          (c) => c.id === header.idCustomer
        );
        if (
          selectedCustomer?.mandatoryFields?.some(
            (f) => f.fieldName === "letDownRatio"
          ) &&
          header.ratio !== undefined
        ) {
          newFormData.letDownRatio = header.ratio;
        }
      }

      setFormData(newFormData);
    }
  }, [editingItem, header, customers]);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleUpdate = async (e) => {
    e.preventDefault();

    if (!editingItem) return;

    let selectedCustomer = null;
    if (customers && customers.length > 0 && header?.idCustomer) {
      selectedCustomer = customers.find((c) => c.id === header.idCustomer);
    }
    const customerMandatoryFields =
      selectedCustomer?.mandatoryFields?.map((f) => ({
        key: f.fieldName,
        label: f.fieldName
          .replace(/([A-Z])/g, " $1")
          .replace(/^./, (str) => str.toUpperCase()),
      })) || [];

    const mandatoryFields = [
      { key: "qty", label: "Quantity" },
      { key: "lineNo", label: "Line" },
      { key: "analysisDate", label: "Checked At" },
      ...customerMandatoryFields.filter(
        (f) =>
          ![
            "qty",
            "lineNo",
            "analysisDate",
            "colorDeltaE",
            "tintDeltaE",
          ].includes(f.key)
      ),
    ];

    const emptyField = mandatoryFields.find(
      (field) =>
        formData[field.key] === "" ||
        formData[field.key] === null ||
        formData[field.key] === undefined
    );
    if (emptyField) {
      toast.error(`Field '${emptyField.label}' wajib diisi!`);
      return;
    }

    try {
      const payload = Object.fromEntries(
        Object.entries(formData).map(([key, value]) => {
          if (value === "" || value === null) {
            return [key, null];
          }
          if (
            [
              "qty",
              "lineNo",
              "tintDeltaL",
              "tintDeltaA",
              "tintDeltaB",
              "colorDeltaL",
              "colorDeltaA",
              "colorDeltaB",
              "deltaP",
              "density",
              "mfr",
              "dispersibility",
              "contamination",
              "macaroni",
              "pelletLength",
              "pelletDiameter",
              "moisture",
              "carbonContent",
              "foreignMatter",
              "weightOfChips",
              "intrinsicViscosity",
              "ashContent",
              "heatStability",
              "lightFastness",
              "granule",
            ].includes(key)
          ) {
            return [key, Number(value)];
          }
          if (key === "analysisDate") {
            return [key, new Date(value).toISOString()];
          }
          return [key, value];
        })
      );

      const response = await dispatch(
        asyncUpdatePlanningDetail({
          id: editingItem.id,
          data: payload,
          lotNumber: lot,
        })
      );

      if (response && response.status === "success") {
        onOpenChange(false);
      } else {
        toast.error(response?.message || "Update gagal");
      }
    } catch (error) {
      toast.error(error.message || "Terjadi kesalahan saat update");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Update Checking Data</DialogTitle>
          <DialogDescription>
            Update data QC di bawah ini. Klik update jika sudah selesai.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleUpdate}>
          <div className="space-y-6 py-4">
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              <div className="col-span-full">
                <div className="border rounded-lg shadow-md p-4">
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-4">
                    <div className="space-y-2">
                      <Label htmlFor="qty">Quantity</Label>
                      <Input
                        id="qty"
                        type="number"
                        step="0.001"
                        placeholder="102.036"
                        value={formData.qty}
                        onChange={(e) =>
                          handleInputChange("qty", e.target.value)
                        }
                        onWheel={(e) => e.target.blur()}
                        className="h-8 text-sm py-1 px-2"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lineNo">Line No</Label>
                      <Input
                        id="lineNo"
                        type="number"
                        placeholder="1"
                        value={formData.lineNo}
                        onChange={(e) =>
                          handleInputChange("lineNo", e.target.value)
                        }
                        onWheel={(e) => e.target.blur()}
                        className="h-8 text-sm py-1 px-2"
                      />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="analysisDate">Analysis Date</Label>
                      <Input
                        id="analysisDate"
                        type="datetime-local"
                        value={formData.analysisDate}
                        onChange={(e) =>
                          handleInputChange("analysisDate", e.target.value)
                        }
                        className="h-8 text-sm py-1 px-2"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Tint Section */}
              <div className="col-span-full pt-4">
                <div className="border rounded-lg shadow-md p-4">
                  <h3 className="text-center font-semibold">Tint</h3>
                  <Separator className="mt-2" />
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 mt-4">
                    <div className="space-y-2">
                      <Label htmlFor="tintDeltaL">ΔL</Label>
                      <Input
                        id="tintDeltaL"
                        type="number"
                        step="0.01"
                        value={formData.tintDeltaL}
                        onChange={(e) =>
                          handleInputChange("tintDeltaL", e.target.value)
                        }
                        onWheel={(e) => e.target.blur()}
                        className="h-8 text-sm py-1 px-2"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="tintDeltaA">Δa</Label>
                      <Input
                        id="tintDeltaA"
                        type="number"
                        step="0.01"
                        value={formData.tintDeltaA}
                        onChange={(e) =>
                          handleInputChange("tintDeltaA", e.target.value)
                        }
                        onWheel={(e) => e.target.blur()}
                        className="h-8 text-sm py-1 px-2"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="tintDeltaB">Δb</Label>
                      <Input
                        id="tintDeltaB"
                        type="number"
                        step="0.01"
                        value={formData.tintDeltaB}
                        onChange={(e) =>
                          handleInputChange("tintDeltaB", e.target.value)
                        }
                        onWheel={(e) => e.target.blur()}
                        className="h-8 text-sm py-1 px-2"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Color Section */}
              <div className="col-span-full pt-4">
                <div className="border rounded-lg shadow-md p-4 bg-white">
                  <h3 className="text-center font-semibold">Color</h3>
                  <Separator className="mt-2 mb-4" />
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="colorDeltaL">ΔL</Label>
                      <Input
                        id="colorDeltaL"
                        type="number"
                        step="0.01"
                        value={formData.colorDeltaL}
                        onChange={(e) =>
                          handleInputChange("colorDeltaL", e.target.value)
                        }
                        onWheel={(e) => e.target.blur()}
                        className="h-8 text-sm py-1 px-2"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="colorDeltaA">Δa</Label>
                      <Input
                        id="colorDeltaA"
                        type="number"
                        step="0.01"
                        value={formData.colorDeltaA}
                        onChange={(e) =>
                          handleInputChange("colorDeltaA", e.target.value)
                        }
                        onWheel={(e) => e.target.blur()}
                        className="h-8 text-sm py-1 px-2"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="colorDeltaB">Δb</Label>
                      <Input
                        id="colorDeltaB"
                        type="number"
                        step="0.01"
                        value={formData.colorDeltaB}
                        onChange={(e) =>
                          handleInputChange("colorDeltaB", e.target.value)
                        }
                        onWheel={(e) => e.target.blur()}
                        className="h-8 text-sm py-1 px-2"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Other Parameters Section */}
              <div className="col-span-full pt-4">
                <h3 className="text-center font-semibold">Other Parameters</h3>
                <Separator className="mt-2" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="deltaP">ΔP</Label>
                <Input
                  id="deltaP"
                  type="number"
                  step="0.01"
                  value={formData.deltaP}
                  onChange={(e) => handleInputChange("deltaP", e.target.value)}
                  onWheel={(e) => e.target.blur()}
                  className="h-8 text-sm py-1 px-2"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="density">Density</Label>
                <Input
                  id="density"
                  type="number"
                  step="0.1"
                  value={formData.density}
                  onChange={(e) => handleInputChange("density", e.target.value)}
                  onWheel={(e) => e.target.blur()}
                  className="h-8 text-sm py-1 px-2"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="mfr">MFR</Label>
                <Input
                  id="mfr"
                  type="number"
                  step="0.1"
                  value={formData.mfr}
                  onChange={(e) => handleInputChange("mfr", e.target.value)}
                  onWheel={(e) => e.target.blur()}
                  className="h-8 text-sm py-1 px-2"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="dispersibility">Dispersibility</Label>
                <Input
                  id="dispersibility"
                  type="number"
                  step="0.1"
                  value={formData.dispersibility}
                  onChange={(e) =>
                    handleInputChange("dispersibility", e.target.value)
                  }
                  onWheel={(e) => e.target.blur()}
                  className="h-8 text-sm py-1 px-2"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="contamination">Contamination</Label>
                <Input
                  id="contamination"
                  type="number"
                  step="0.1"
                  value={formData.contamination}
                  onChange={(e) =>
                    handleInputChange("contamination", e.target.value)
                  }
                  onWheel={(e) => e.target.blur()}
                  className="h-8 text-sm py-1 px-2"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="macaroni">Macaroni</Label>
                <Input
                  id="macaroni"
                  type="number"
                  step="0.1"
                  value={formData.macaroni}
                  onChange={(e) =>
                    handleInputChange("macaroni", e.target.value)
                  }
                  onWheel={(e) => e.target.blur()}
                  className="h-8 text-sm py-1 px-2"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="pelletLength">Pellet Length</Label>
                <Input
                  id="pelletLength"
                  type="number"
                  step="0.1"
                  value={formData.pelletLength}
                  onChange={(e) =>
                    handleInputChange("pelletLength", e.target.value)
                  }
                  onWheel={(e) => e.target.blur()}
                  className="h-8 text-sm py-1 px-2"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="pelletDiameter">Pellet Diameter</Label>
                <Input
                  id="pelletDiameter"
                  type="number"
                  step="0.1"
                  value={formData.pelletDiameter}
                  onChange={(e) =>
                    handleInputChange("pelletDiameter", e.target.value)
                  }
                  onWheel={(e) => e.target.blur()}
                  className="h-8 text-sm py-1 px-2"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="moisture">Moisture</Label>
                <Input
                  id="moisture"
                  type="number"
                  step="0.01"
                  value={formData.moisture}
                  onChange={(e) =>
                    handleInputChange("moisture", e.target.value)
                  }
                  onWheel={(e) => e.target.blur()}
                  className="h-8 text-sm py-1 px-2"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="carbonContent">Carbon Content</Label>
                <Input
                  id="carbonContent"
                  type="number"
                  step="0.1"
                  value={formData.carbonContent}
                  onChange={(e) =>
                    handleInputChange("carbonContent", e.target.value)
                  }
                  onWheel={(e) => e.target.blur()}
                  className="h-8 text-sm py-1 px-2"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="foreignMatter">Foreign Matter</Label>
                <Input
                  id="foreignMatter"
                  type="number"
                  step="0.1"
                  value={formData.foreignMatter}
                  onChange={(e) =>
                    handleInputChange("foreignMatter", e.target.value)
                  }
                  onWheel={(e) => e.target.blur()}
                  className="h-8 text-sm py-1 px-2"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="weightOfChips">Weight Of Chips</Label>
                <Input
                  id="weightOfChips"
                  type="number"
                  step="0.1"
                  value={formData.weightOfChips}
                  onChange={(e) =>
                    handleInputChange("weightOfChips", e.target.value)
                  }
                  onWheel={(e) => e.target.blur()}
                  className="h-8 text-sm py-1 px-2"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="intrinsicViscosity">Intrinsic Viscosity</Label>
                <Input
                  id="intrinsicViscosity"
                  type="number"
                  step="0.1"
                  value={formData.intrinsicViscosity}
                  onChange={(e) =>
                    handleInputChange("intrinsicViscosity", e.target.value)
                  }
                  onWheel={(e) => e.target.blur()}
                  className="h-8 text-sm py-1 px-2"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="ashContent">Ash Content</Label>
                <Input
                  id="ashContent"
                  type="number"
                  step="0.01"
                  value={formData.ashContent}
                  onChange={(e) =>
                    handleInputChange("ashContent", e.target.value)
                  }
                  onWheel={(e) => e.target.blur()}
                  className="h-8 text-sm py-1 px-2"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="heatStability">Heat Stability</Label>
                <Input
                  id="heatStability"
                  type="number"
                  step="0.1"
                  value={formData.heatStability}
                  onChange={(e) =>
                    handleInputChange("heatStability", e.target.value)
                  }
                  onWheel={(e) => e.target.blur()}
                  className="h-8 text-sm py-1 px-2"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lightFastness">Light Fastness</Label>
                <Input
                  id="lightFastness"
                  type="number"
                  step="0.1"
                  value={formData.lightFastness}
                  onChange={(e) =>
                    handleInputChange("lightFastness", e.target.value)
                  }
                  onWheel={(e) => e.target.blur()}
                  className="h-8 text-sm py-1 px-2"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="granule">Granule</Label>
                <Input
                  id="granule"
                  type="number"
                  step="0.1"
                  value={formData.granule}
                  onChange={(e) => handleInputChange("granule", e.target.value)}
                  onWheel={(e) => e.target.blur()}
                  className="h-8 text-sm py-1 px-2"
                />
              </div>
              {/* <div className="space-y-2">
                <Label htmlFor="letDownRatio">Letdown Ratio</Label>
                <Input
                  id="letDownRatio"
                  type="number"
                  step="0.1"
                  value={formData.letDownRatio}
                  onChange={(e) =>
                    handleInputChange("letDownRatio", e.target.value)
                  }
                  onWheel={(e) => e.target.blur()}
                  className="h-8 text-sm py-1 px-2"
                />
              </div> */}
            </div>
            <div className="flex space-x-4 border rounded-lg shadow-md p-4 mb-4 bg-white">
              <div className="space-y-2 flex-1">
                <Label htmlFor="visualCheck">Visual Check</Label>
                <Select
                  value={formData.visualCheck}
                  onValueChange={(value) =>
                    handleInputChange("visualCheck", value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Ok">Ok</SelectItem>
                    <SelectItem value="Not Good">Not Good</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2 flex-1">
                <Label htmlFor="colorCheck">Color Check</Label>
                <Select
                  value={formData.colorCheck}
                  onValueChange={(value) =>
                    handleInputChange("colorCheck", value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Ok">Ok</SelectItem>
                    <SelectItem value="Not Good">Not Good</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="remark">Remark</Label>
              <Input
                id="remark"
                placeholder="Additional notes or comments"
                value={formData.remark}
                onChange={(e) => handleInputChange("remark", e.target.value)}
                className="h-8 text-sm py-1 px-2"
              />
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline">
                Batal
              </Button>
            </DialogClose>
            <Button type="submit">Update</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

PlanningDetailUpdateDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  onOpenChange: PropTypes.func.isRequired,
  editingItem: PropTypes.object,
};
