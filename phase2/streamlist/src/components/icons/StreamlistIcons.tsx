/**
 * Material Symbols–style glyphs (24dp paths) for StreamList / Stitch “Cinema Noir”.
 * Paths match Google Material Icons outlined/filled sets (viewBox 0 0 24 24).
 */
import React from 'react';
import Svg, { Path } from 'react-native-svg';

export interface IconProps {
  size?: number;
  color: string;
}

function IconWrapper(
  props: IconProps & { children: React.ReactNode },
): React.ReactElement {
  const { size = 24, color, children } = props;
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" accessible={false}>
      {children}
    </Svg>
  );
}

/** Tab: home — filled when `focused` (matches Stitch bottom nav). */
export function IconHome(props: IconProps & { filled?: boolean }): React.ReactElement {
  const { filled, color, size } = props;
  const d = filled
    ? 'M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z'
    : 'M12 5.69l5 4.5V18h-2v-6H9v6H7v-7.81l5-4.5M12 3L2 12h3v8h6v-6h2v6h6v-8h3L12 3z';
  return (
    <IconWrapper size={size} color={color}>
      <Path fill={color} d={d} />
    </IconWrapper>
  );
}

export function IconSearch(props: IconProps): React.ReactElement {
  return (
    <IconWrapper size={props.size} color={props.color}>
      <Path
        fill={props.color}
        d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"
      />
    </IconWrapper>
  );
}

export function IconBookmarkOutline(props: IconProps): React.ReactElement {
  return (
    <IconWrapper size={props.size} color={props.color}>
      <Path
        fill={props.color}
        d="M17 3H7c-1.1 0-2 .9-2 2v16l7-3 7 3V5c0-1.1-.9-2-2-2zm0 15l-5-2.18L7 18V5h10v13z"
      />
    </IconWrapper>
  );
}

/** Detail CTA — Material Symbols `bookmark_add` (filled). */
export function IconBookmarkAdd(props: IconProps): React.ReactElement {
  return (
    <IconWrapper size={props.size} color={props.color}>
      <Path
        fill={props.color}
        d="M5 21V5q0-.825.588-1.412T7 3h7q-.5.75-.75 1.438T13 6q0 1.8 1.138 3.175T17 10.9q.575.075 1 .075t1-.075V21l-7-3zM17 9V7h-2V5h2V3h2v2h2v2h-2v2z"
      />
    </IconWrapper>
  );
}

/** Detail CTA — Material Symbols `bookmark_added` (filled). */
export function IconBookmarkAdded(props: IconProps): React.ReactElement {
  return (
    <IconWrapper size={props.size} color={props.color}>
      <Path
        fill={props.color}
        d="M17.825 9L15 6.175l1.4-1.425l1.425 1.425l3.525-3.55l1.425 1.425zM5 21V5q0-.825.588-1.412T7 3h7q-.5.75-.75 1.438T13 6q0 1.8 1.138 3.175T17 10.9q.575.075 1 .075t1-.075V21l-7-3z"
      />
    </IconWrapper>
  );
}

export function IconPersonOutline(props: IconProps): React.ReactElement {
  return (
    <IconWrapper size={props.size} color={props.color}>
      <Path
        fill={props.color}
        d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"
      />
    </IconWrapper>
  );
}

export function IconNotificationsOutline(props: IconProps): React.ReactElement {
  return (
    <IconWrapper size={props.size} color={props.color}>
      <Path
        fill={props.color}
        d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.89 2 2 2zm6-6v-5c0-3.07-1.63-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.64 5.36 6 7.92 6 11v5l-2 2v1h17v-1l-2-2zm-2 1H8v-4c0-2.48 1.51-4.5 4-4.5s4 2.02 4 4.5v4z"
      />
    </IconWrapper>
  );
}

/** Top bar brand mark — Material “movie” (clapper). */
export function IconMovie(props: IconProps): React.ReactElement {
  return (
    <IconWrapper size={props.size} color={props.color}>
      <Path
        fill={props.color}
        d="M18 4l2 4h-3l-2-4h-2l2 4h-3l-2-4H8l2 4H7L5 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.89 2 1.99 2h16.02c1.1 0 1.99-.9 1.99-2V4h-4zm-7 14c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3z"
      />
    </IconWrapper>
  );
}

/** Filled play (matches Stitch `play_arrow` + FILL 1). */
export function IconPlayArrowFilled(props: IconProps): React.ReactElement {
  return (
    <IconWrapper size={props.size} color={props.color}>
      <Path fill={props.color} d="M8 5v14l11-7z" />
    </IconWrapper>
  );
}

export function IconArrowBack(props: IconProps): React.ReactElement {
  return (
    <IconWrapper size={props.size} color={props.color}>
      <Path
        fill={props.color}
        d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"
      />
    </IconWrapper>
  );
}

/** Material Symbols `share` outline — detail app bar. */
export function IconShare(props: IconProps): React.ReactElement {
  return (
    <IconWrapper size={props.size} color={props.color}>
      <Path
        fill={props.color}
        d="M17 22q-1.25 0-2.125-.875T14 19q0-.15.075-.7L7.05 14.2q-.4.375-.925.588T5 15q-1.25 0-2.125-.875T2 12t.875-2.125T5 9q.6 0 1.125.213t.925.587l7.025-4.1q-.05-.175-.062-.337T14 5q0-1.25.875-2.125T17 2t2.125.875T20 5t-.875 2.125T17 8q-.6 0-1.125-.213T14.95 7.2l-7.025 4.1q.05.175.063.338T8 12t-.012.363t-.063.337l7.025 4.1q.4-.375.925-.587T17 16q1.25 0 2.125.875T20 19t-.875 2.125T17 22m0-2q.425 0 .713-.287T18 19t-.288-.712T17 18t-.712.288T16 19t.288.713T17 20M5 13q.425 0 .713-.288T6 12t-.288-.712T5 11t-.712.288T4 12t.288.713T5 13m12.713-7.288Q18 5.426 18 5t-.288-.712T17 4t-.712.288T16 5t.288.713T17 6t.713-.288M17 5"
      />
    </IconWrapper>
  );
}

/** Filled star — rating chip on detail. */
export function IconStarFilled(props: IconProps): React.ReactElement {
  return (
    <IconWrapper size={props.size} color={props.color}>
      <Path
        fill={props.color}
        d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"
      />
    </IconWrapper>
  );
}
