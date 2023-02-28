import * as React from "react";
import { StatHeadTr } from "./types";

interface Props {
  headColumns: StatHeadTr[];
}

function StatTableTHead({ headColumns }: Props) {
  return (
    <thead>
      {headColumns.map((h, hi) => (
        <tr key={hi}>
          {h.children?.map((th, thi) => (
            <th key={thi} colSpan={th.colspan} rowSpan={th.rowspan} align={th.align ?? "center"}>
              {th.label}
            </th>
          ))}
          <th />
        </tr>
      ))}
    </thead>
  );
}

export { StatTableTHead };
