import * as React from 'react';
import { SelectType } from 'states';
import { i18n } from 'i18n';
import { Empty } from 'widgets/Empty';
import { Props } from './types';
import { ComponentTriggerSelector } from './ComponentTriggerSelector';
import { PluginTriggerSelector } from './PluginTriggerSelector';

export function TriggerSelector(props: Props) {
  switch (props.type) {
    case SelectType.COMPONENT:
      return React.createElement(ComponentTriggerSelector, props);
    case SelectType.PLUGIN:
      return React.createElement(PluginTriggerSelector, props);
    default:
      return <Empty text={i18n.t('Not available')} />;
  }
}
