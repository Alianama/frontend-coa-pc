import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useDispatch, useSelector } from "react-redux";
import {
  asyncAddPlanningDetail,
  asyncGetPlanningDetailByLot,
} from "@/store/planningDetail/action";
import { useParams, useNavigate } from "react-router-dom";
import DetailHeader from "./PlanningDetailHeader";
import { toast } from "sonner";

export default function PlanningDetailForm() {
  const dispatch = useDispatch();
  const { lot } = useParams();
  const navigate = useNavigate();
  const { header, totalQtyCheck } = useSelector(
    (state) => state.planningDetail
  );

  // Inisialisasi formData tanpa idPlanning, akan di-set setelah header tersedia
  const [formData, setFormData] = useState({
    qty: "",
    idPlanning: "",
    lineNo: "",
    deltaL: "",
    deltaA: "",
    deltaB: "",
    density: "",
    mfr: "",
    dispersion: "",
    contamination: "",
    macaroni: "",
    pelletLength: "",
    pelletDiameter: "",
    visualCheck: "",
    moisture: "",
    carbonContent: "",
    foreignMatter: "",
    weightChips: "",
    intrinsicViscosity: "",
    ashContent: "",
    heatStability: "",
    lightFastness: "",
    granule: "",
    analysisDate: "",
    checkedBy: "",
    remark: "",
  });

  // Ambil data planning detail berdasarkan lot
  useEffect(() => {
    dispatch(asyncGetPlanningDetailByLot(lot));
  }, [dispatch, lot]);

  // Set idPlanning ke formData setelah header tersedia
  useEffect(() => {
    if (header?.id) {
      setFormData((prev) => ({
        ...prev,
        idPlanning: header.id,
      }));
    }
  }, [header]);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const mandatoryFields = [
      { key: "qty", label: "Quantity" },
      { key: "lineNo", label: "Line" },
      { key: "deltaL", label: "Δ L" },
      { key: "deltaA", label: "Δ A" },
      { key: "deltaB", label: "Δ B" },
      { key: "mfr", label: "MFR (gr/mnt)" },
      { key: "dispersion", label: "Dispersion" },
      { key: "density", label: "Density" },
      { key: "pelletLength", label: "Pallet Length" },
      { key: "pelletDiameter", label: "Pallet Diameter" },
      { key: "analysisDate", label: "Checked At" },
      { key: "visualCheck", label: "Visual Check" },
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

    // Konversi tipe data sesuai kebutuhan
    const dataToSubmit = {
      ...formData,
      qty: formData.qty === "" ? null : Number(formData.qty),
      idPlanning:
        formData.idPlanning === "" ? null : Number(formData.idPlanning),
      lineNo: formData.lineNo === "" ? null : Number(formData.lineNo),
      deltaL: formData.deltaL === "" ? null : Number(formData.deltaL),
      deltaA: formData.deltaA === "" ? null : Number(formData.deltaA),
      deltaB: formData.deltaB === "" ? null : Number(formData.deltaB),
      density: formData.density === "" ? null : Number(formData.density),
      mfr: formData.mfr === "" ? null : Number(formData.mfr),
      dispersion:
        formData.dispersion === "" ? null : Number(formData.dispersion),
      contamination:
        formData.contamination === "" ? null : Number(formData.contamination),
      macaroni: formData.macaroni === "" ? null : Number(formData.macaroni),
      pelletLength:
        formData.pelletLength === "" ? null : Number(formData.pelletLength),
      pelletDiameter:
        formData.pelletDiameter === "" ? null : Number(formData.pelletDiameter),
      visualCheck: formData.visualCheck === "" ? null : formData.visualCheck, // string, jika perlu number, gunakan Number()
      moisture: formData.moisture === "" ? null : Number(formData.moisture),
      carbonContent:
        formData.carbonContent === "" ? null : Number(formData.carbonContent),
      foreignMatter:
        formData.foreignMatter === "" ? null : Number(formData.foreignMatter),
      weightChips:
        formData.weightChips === "" ? null : Number(formData.weightChips),
      intrinsicViscosity:
        formData.intrinsicViscosity === ""
          ? null
          : Number(formData.intrinsicViscosity),
      ashContent:
        formData.ashContent === "" ? null : Number(formData.ashContent),
      heatStability:
        formData.heatStability === "" ? null : Number(formData.heatStability),
      lightFastness:
        formData.lightFastness === "" ? null : Number(formData.lightFastness),
      granule: formData.granule === "" ? null : Number(formData.granule),
      analysisDate:
        formData.analysisDate === ""
          ? null
          : new Date(formData.analysisDate).toISOString(),
      checkedBy: formData.checkedBy,
      remark: formData.remark,
    };

    const response = await dispatch(asyncAddPlanningDetail(dataToSubmit));
    // Jika sukses, navigate ke /planning
    if (response && response.status === "success") {
      navigate(`/planning/check/${lot}`);
    }
  };

  return (
    <div className="flex flex-col gap-5">
      <div className="text-center">
        <h1 className="text-3xl font-bold">Quality Control Form</h1>
        <p className="mt-2">Masukkan data QC dan klik Save untuk simpan</p>
      </div>
      {header && <DetailHeader quantityCheck={totalQtyCheck} header={header} />}
      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader>
            <CardTitle>QC Data Entry</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 lg:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor="qty">Quantity</Label>
                <Input
                  id="qty"
                  type="number"
                  step="0.001"
                  placeholder="102.036"
                  value={formData.qty}
                  onChange={(e) => handleInputChange("qty", e.target.value)}
                  onWheel={(e) => e.target.blur()}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lineNo">Line No</Label>
                <Input
                  id="lineNo"
                  type="number"
                  placeholder="1"
                  value={formData.lineNo}
                  onChange={(e) => handleInputChange("lineNo", e.target.value)}
                  onWheel={(e) => e.target.blur()}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="analysisDate">Analysis Date</Label>
                <Input
                  id="analysisDate"
                  type="datetime-local"
                  value={formData.analysisDate}
                  onChange={(e) =>
                    handleInputChange("analysisDate", e.target.value)
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="deltaL">ΔL</Label>
                <Input
                  id="deltaL"
                  type="number"
                  step="0.01"
                  placeholder="0.35"
                  value={formData.deltaL}
                  onChange={(e) => handleInputChange("deltaL", e.target.value)}
                  onWheel={(e) => e.target.blur()}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="deltaA">Δa</Label>
                <Input
                  id="deltaA"
                  type="number"
                  step="0.01"
                  placeholder="0.20"
                  value={formData.deltaA}
                  onChange={(e) => handleInputChange("deltaA", e.target.value)}
                  onWheel={(e) => e.target.blur()}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="deltaB">Δb</Label>
                <Input
                  id="deltaB"
                  type="number"
                  step="0.01"
                  placeholder="0.35"
                  value={formData.deltaB}
                  onChange={(e) => handleInputChange("deltaB", e.target.value)}
                  onWheel={(e) => e.target.blur()}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="density">Density</Label>
                <Input
                  id="density"
                  type="number"
                  step="0.1"
                  placeholder="1.2"
                  value={formData.density}
                  onChange={(e) => handleInputChange("density", e.target.value)}
                  onWheel={(e) => e.target.blur()}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="mfr">MFR</Label>
                <Input
                  id="mfr"
                  type="number"
                  step="0.1"
                  placeholder="12.5"
                  value={formData.mfr}
                  onChange={(e) => handleInputChange("mfr", e.target.value)}
                  onWheel={(e) => e.target.blur()}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="dispersion">Dispersion</Label>
                <Input
                  id="dispersion"
                  type="number"
                  step="0.1"
                  placeholder="3.0"
                  value={formData.dispersion}
                  onChange={(e) =>
                    handleInputChange("dispersion", e.target.value)
                  }
                  onWheel={(e) => e.target.blur()}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="contamination">Contamination</Label>
                <Input
                  id="contamination"
                  type="number"
                  step="0.1"
                  placeholder="0.0"
                  value={formData.contamination}
                  onChange={(e) =>
                    handleInputChange("contamination", e.target.value)
                  }
                  onWheel={(e) => e.target.blur()}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="macaroni">Macaroni</Label>
                <Input
                  id="macaroni"
                  type="number"
                  step="0.1"
                  placeholder="0.8"
                  value={formData.macaroni}
                  onChange={(e) =>
                    handleInputChange("macaroni", e.target.value)
                  }
                  onWheel={(e) => e.target.blur()}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="pelletLength">Pellet Length</Label>
                <Input
                  id="pelletLength"
                  type="number"
                  step="0.1"
                  placeholder="2.5"
                  value={formData.pelletLength}
                  onChange={(e) =>
                    handleInputChange("pelletLength", e.target.value)
                  }
                  onWheel={(e) => e.target.blur()}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="pelletDiameter">Pellet Diameter</Label>
                <Input
                  id="pelletDiameter"
                  type="number"
                  step="0.1"
                  placeholder="1.1"
                  value={formData.pelletDiameter}
                  onChange={(e) =>
                    handleInputChange("pelletDiameter", e.target.value)
                  }
                  onWheel={(e) => e.target.blur()}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="moisture">Moisture</Label>
                <Input
                  id="moisture"
                  type="number"
                  step="0.01"
                  placeholder="0.05"
                  value={formData.moisture}
                  onChange={(e) =>
                    handleInputChange("moisture", e.target.value)
                  }
                  onWheel={(e) => e.target.blur()}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="carbonContent">Carbon Content</Label>
                <Input
                  id="carbonContent"
                  type="number"
                  step="0.1"
                  placeholder="0.3"
                  value={formData.carbonContent}
                  onChange={(e) =>
                    handleInputChange("carbonContent", e.target.value)
                  }
                  onWheel={(e) => e.target.blur()}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="foreignMatter">Foreign Matter</Label>
                <Input
                  id="foreignMatter"
                  type="number"
                  step="0.1"
                  placeholder="0.0"
                  value={formData.foreignMatter}
                  onChange={(e) =>
                    handleInputChange("foreignMatter", e.target.value)
                  }
                  onWheel={(e) => e.target.blur()}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="weightChips">Weight Chips</Label>
                <Input
                  id="weightChips"
                  type="number"
                  step="0.1"
                  placeholder="0.9"
                  value={formData.weightChips}
                  onChange={(e) =>
                    handleInputChange("weightChips", e.target.value)
                  }
                  onWheel={(e) => e.target.blur()}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="intrinsicViscosity">Intrinsic Viscosity</Label>
                <Input
                  id="intrinsicViscosity"
                  type="number"
                  step="0.1"
                  placeholder="0.7"
                  value={formData.intrinsicViscosity}
                  onChange={(e) =>
                    handleInputChange("intrinsicViscosity", e.target.value)
                  }
                  onWheel={(e) => e.target.blur()}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="ashContent">Ash Content</Label>
                <Input
                  id="ashContent"
                  type="number"
                  step="0.01"
                  placeholder="0.02"
                  value={formData.ashContent}
                  onChange={(e) =>
                    handleInputChange("ashContent", e.target.value)
                  }
                  onWheel={(e) => e.target.blur()}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="heatStability">Heat Stability</Label>
                <Input
                  id="heatStability"
                  type="number"
                  step="0.1"
                  placeholder="4.5"
                  value={formData.heatStability}
                  onChange={(e) =>
                    handleInputChange("heatStability", e.target.value)
                  }
                  onWheel={(e) => e.target.blur()}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lightFastness">Light Fastness</Label>
                <Input
                  id="lightFastness"
                  type="number"
                  step="0.1"
                  placeholder="5.0"
                  value={formData.lightFastness}
                  onChange={(e) =>
                    handleInputChange("lightFastness", e.target.value)
                  }
                  onWheel={(e) => e.target.blur()}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="granule">Granule</Label>
                <Input
                  id="granule"
                  type="number"
                  step="0.1"
                  placeholder="1.0"
                  value={formData.granule}
                  onChange={(e) => handleInputChange("granule", e.target.value)}
                  onWheel={(e) => e.target.blur()}
                />
              </div>
            </div>
            <div className="space-y-2">
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
            <div className="space-y-2">
              <Label htmlFor="remark">Remark</Label>
              <Input
                id="remark"
                placeholder="Additional notes or comments"
                value={formData.remark}
                onChange={(e) => handleInputChange("remark", e.target.value)}
              />
            </div>
            <Button type="submit" className="w-full shadow-2xs" size="lg">
              Save
            </Button>
          </CardContent>
        </Card>
      </form>
    </div>
  );
}
