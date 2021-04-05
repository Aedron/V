import * as React from 'react';
import { useMemo } from 'react';
import { ComponentInstance, HotArea } from '@vize/types';
import { NodeEventProxy } from '../NodeEventProxy';
import { AppRenderProps } from '../AppRender/types';

interface Props extends Pick<AppRenderProps, 'globalData' | 'pageData' | 'meta' | 'router'> {
  componentInstance: ComponentInstance;
  hotArea: HotArea;
}

export function HotAreaItem({ hotArea, globalData, pageData, meta, router }: Props) {
  const { size, position } = hotArea;
  const style = useMemo(
    () => ({
      width: percent(size.width),
      height: percent(size.height),
      left: percent(position.x),
      top: percent(position.y),
    }),
    [size, position],
  );

  return (
    <NodeEventProxy<HotArea>
      className="hotarea-event-proxy"
      childrenType="hotarea"
      instance={hotArea}
      meta={meta}
      globalData={globalData}
      pageData={pageData}
      router={router}
      previewMode={false}
      style={style}
    />
  );
}

export function percent(percent: number): string {
  return `${percent}%`;
}
