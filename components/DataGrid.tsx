import * as React from "react";
import styled from "@emotion/styled";
import { AXFDGProps, AXFDataGrid } from "@axframe/datagrid";
import { css } from "@emotion/react";
import { darken } from "../../styles/palette/colorUtil";

interface Props<T> extends AXFDGProps<T> {}

export function DataGrid<T>({ width, height, showLineNumber = true, ...rest }: Props<T>) {
  if (width === 0 || height === 0) {
    return null;
  }

  return (
    <Container>
      <AXFDataGrid
        width={width}
        height={height}
        headerHeight={28}
        itemHeight={20}
        footerHeight={28}
        showLineNumber={showLineNumber}
        {...rest}
      />
    </Container>
  );
}

const Container = styled.div`
  position: absolute;
  overflow: hidden;

  [role="@axframe/datagrid"] {
    //transition: all 0.1s;
  }

  ${({ theme }) => {
    return css`
      [role="axframe-datagrid"] {
        --axfdg-primary-color: ${darken(theme.primary_color, 0.2)};
        --axfdg-header-bg: ${theme.axfdg_header_bg};
        --axfdg-header-color: ${theme.axfdg_header_color};
        --axfdg-header-font-weight: ${theme.axfdg_header_font_weight};
        --axfdg-header-hover-bg: ${theme.axfdg_header_hover_bg};
        --axfdg-header-group-bg: ${theme.axfdg_header_group_bg};
        --axfdg-footer-bg: ${theme.axfdg_footer_bg};
        --axfdg-border-color-base: ${theme.axfdg_border_color_base};
        --axfdg-border-radius: ${theme.axfdg_border_radius};
        --axfdg-row-selector-color: ${theme.axfdg_row_selector_color};
        --axfdg-body-bg: ${theme.axfdg_body_bg};
        --axfdg-body-odd-bg: ${theme.axfdg_body_odd_bg};
        --axfdg-body-hover-bg: ${theme.axfdg_body_hover_bg};
        --axfdg-body-hover-odd-bg: ${theme.axfdg_body_hover_odd_bg};
        --axfdg-body-active-bg: ${theme.axfdg_body_active_bg};
        --axfdg-body-color: ${theme.axfdg_body_color};

        --axfdg-scroll-size: ${theme.axfdg_scroll_size};
        --axfdg-scroll-track-bg: ${theme.axfdg_scroll_track_bg};
        --axfdg-scroll-thumb-radius: ${theme.axfdg_scroll_thumb_radius};
        --axfdg-scroll-thumb-bg: ${theme.axfdg_scroll_thumb_bg};
        --axfdg-scroll-thumb-hover-bg: ${theme.axfdg_scroll_thumb_hover_bg};

        --axfdg-loading-bg: ${theme.axfdg_loading_bg};
        --axfdg-loading-color: ${theme.axfdg_loading_color};
        --axfdg-loading-second-color: ${theme.axfdg_loading_second_color};
      }

      [role="rfdg-scroll-container"] {
        background: ${theme.component_background};
      }
    `;
  }}
`;
