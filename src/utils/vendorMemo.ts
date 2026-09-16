const MEMO_BY_VENDOR: Record<string, string> = {
  "AAA Drywall": "Drywall Repair - Water damage patch",
  "Anderson Pest Control": "Quarterly Pest Control Service",
  "Lowe's": "Maintenance Supplies",
  "Miller Valentine": "Property Renovation - Unit Turnover",
  "Premiere Management": "Management Fee",
  "J&M Construction": "Structural Repair - Foundation crack",
  "Ironclad Cement": "Sidewalk Repair - Cement Pour",
  "Silver Pines Landscaping": "Landscaping - Monthly Service",
  "L&S Fencing": "Fencing Repairs - Tree fell on fence",
  "Thompson Trash Removal": "Trash Removal Service",
  "Goldengate Construction": "Roof Repair - Storm damage",
  "Blue Peak Solutions": "HVAC Maintenance",
  "Maple Leaf Catering": "Resident Event Catering",
}

export function memoFor(vendor: string) {
  return MEMO_BY_VENDOR[vendor] ?? `${vendor} - Vendor Payment`
}
