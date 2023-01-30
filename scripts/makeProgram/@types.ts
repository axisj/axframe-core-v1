enum ProgramType {
  DETAIL,
  FORM,
  LIST,
  LIST_AND_DRAWER,
  LIST_AND_MODAL,
  LIST_WITH_FORM,
}

interface Program {
  name: string | string[];
  type: keyof typeof ProgramType;
}
export interface ProgramConfig {
  pagesDir: string;
  templateDir: string;
  programs: Program[];
}
