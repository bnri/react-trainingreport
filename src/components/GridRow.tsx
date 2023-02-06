import { useMemo } from "react";
import styled, { css } from "styled-components";
import { SummaryType, tasknames, tasktypes } from "../types";
import { GridProps } from "./TrainingReport";

interface GridRowProps {
  isMobileWidth: boolean;
  find?: SummaryType;
  task: tasknames | tasktypes | string;
  header?: boolean;
  hideLanguage: boolean;
}

const GridRow: React.FC<GridRowProps> = (props) => {
  const { find, isMobileWidth, task, header, hideLanguage } = props;

  const styles = useMemo<React.CSSProperties>(() => {
    return header
      ? {}
      : {
          background: isMobileWidth ? "#eeedff" : "transparent",
        };
  }, [header, isMobileWidth]);

  if (!find) {
    return (
      <StyledGridRow>
        <StyledGridCell
          header={header}
          isMobileWidth={isMobileWidth}
          style={{
            gridRow: isMobileWidth ? "1/3" : "auto",
          }}
        >
          {task}
        </StyledGridCell>
        <StyledGridCell
          header={header}
          isMobileWidth={isMobileWidth}
          style={{
            gridRow: isMobileWidth ? "1/3" : "auto",
            gridColumn: isMobileWidth ? "2/6" : "2/11",
          }}
        >
          수행 없음
        </StyledGridCell>
      </StyledGridRow>
    );
  } else {
    return (
      <StyledGridRow>
        <StyledGridCell
          header={header}
          isMobileWidth={isMobileWidth}
          style={{
            gridRow: isMobileWidth ? "1/3" : "auto",
          }}
        >
          {task}
        </StyledGridCell>
        <StyledGridCell header={header} order={1} isMobileWidth={isMobileWidth}>
          {parseFloat(find.level.toFixed(1))}
        </StyledGridCell>
        <StyledGridCell header={header} order={3} isMobileWidth={isMobileWidth}>
          {parseFloat(find.reculsiveCount.toFixed(1))}회
        </StyledGridCell>
        <StyledGridCell header={header} order={4} isMobileWidth={isMobileWidth} style={{ display: isMobileWidth ? "none" : "flex" }}>
          {parseFloat(find.weeklyPerformedDays.toFixed(1))}일
        </StyledGridCell>
        <StyledGridCell header={header} order={6} isMobileWidth={isMobileWidth}>
          {parseFloat((find.performedRatio * 100).toFixed(1))}%
        </StyledGridCell>
        <StyledGridCell header={header} order={8} isMobileWidth={isMobileWidth}>
          {parseFloat(find.avgScore.toFixed(1))}점
        </StyledGridCell>
        <StyledGridCell header={header} order={2} isMobileWidth={isMobileWidth} style={styles}>
          {hideLanguage ? "" : find.language}
        </StyledGridCell>
        <StyledGridCell header={header} order={5} isMobileWidth={isMobileWidth} style={styles}>
          {isMobileWidth ? `${find.performedCount}회` : `${find.performedCount} / ${find.needPerformedCount}`}
        </StyledGridCell>
        <StyledGridCell header={header} order={7} isMobileWidth={isMobileWidth} style={styles}>
          {parseFloat(find.totDuration.toFixed(1))}분
        </StyledGridCell>
        <StyledGridCell header={header} order={9} isMobileWidth={isMobileWidth} style={styles}>
          {parseFloat(find.totScore.toFixed(1))}점
        </StyledGridCell>
      </StyledGridRow>
    );
  }
};

export default GridRow;

const StyledGridRow = styled.div<GridProps>`
  width: 100%;
  min-height: 3em;
  display: grid;
  justify-content: center;
  align-items: center;
  border-collapse: collapse;

  grid-template-rows: 1fr 1fr;
  grid-template-columns: 1.3fr repeat(4, 1fr);

  @media screen and (min-width: 501px) {
    min-height: 4em;
    grid-template-rows: 1fr;
    grid-template-columns: 1fr repeat(9, 0.5fr);
  }
`;

const StyledGridCell = styled.div<GridProps>`
  height: 100%;
  padding: 0.5em 0;
  border-right: 1px solid #ada9bb;
  border-bottom: 1px solid #ada9bb;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;

  ${(props) =>
    props.header
      ? css`
          font-size: 1.2em;
          font-weight: 700;
          background: #eeedff;
          @media screen and (min-width: 1024px) {
            font-size: 1.4em;
          }
        `
      : css`
          font-size: 1.1em;
          @media screen and (min-width: 1024px) {
            font-size: 1.2em;
          }
        `}
  ${(props) =>
    !props.isMobileWidth && props.order
      ? css`
          order: ${props.order};
        `
      : css``}
`;
