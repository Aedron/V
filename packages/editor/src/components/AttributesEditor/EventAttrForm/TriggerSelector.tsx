import * as React from 'react';
import { useMemo } from 'react';
import * as R from 'ramda';
import { Select } from 'antd';
import { FiLayers } from 'react-icons/fi';
import {
  ComponentUniversalEventTrigger,
  EventTriggerName,
  HotAreaUniversalEventTrigger,
  MaterialsCustomEvent,
  Maybe,
  PluginUniversalEventTrigger,
} from 'types';
import { SelectType } from 'states';
import { triggerTextMap } from './utils';

const { Option: SelectOption, OptGroup } = Select;

interface Props {
  type: SelectType;
  trigger: Maybe<EventTriggerName>;
  setTrigger: (trigger: EventTriggerName) => void;
  customEvents?: MaterialsCustomEvent[];
}

export function EventTriggerSelector({ type, trigger, setTrigger, customEvents }: Props) {
  const onChange = useMemo(() => R.unary(setTrigger), []);
  const isComponent = type === SelectType.COMPONENT;
  const universalEventTriggers = useMemo(
    () =>
      ({
        [SelectType.COMPONENT]: ComponentUniversalEventTrigger,
        [SelectType.PLUGIN]: PluginUniversalEventTrigger,
        [SelectType.HOTAREA]: HotAreaUniversalEventTrigger,
        [SelectType.GLOBAL]: {} as typeof ComponentUniversalEventTrigger,
      }[type]),
    [type],
  );

  return (
    <div className="event-form-prop-item">
      <span>触发条件:</span>
      <Select
        value={trigger || undefined}
        onChange={onChange}
        className="event-form-selector"
        dropdownClassName="event-form-selector-options"
      >
        {customEvents?.length ? (
          <OptGroup label={`${isComponent ? '组件' : '插件'}自定义触发`}>
            {customEvents.map(({ eventName, displayName }) => (
              <SelectOption value={eventName} key={eventName}>
                <FiLayers />
                {displayName}
              </SelectOption>
            ))}
          </OptGroup>
        ) : null}

        <OptGroup label="通用触发">
          {Object.entries(universalEventTriggers).map(([, trigger]) => (
            <SelectOption value={trigger} key={trigger}>
              {triggerTextMap.get(trigger)}
            </SelectOption>
          ))}
        </OptGroup>
      </Select>
    </div>
  );
}
