import { MaterialsForm, MaterialsInfo } from './materials';
import { MaterialsCustomEvent } from './events';
import { EventInstance } from './events';

export interface MaterialsPluginMeta {
  identityName: string;
  lib: string;
  name: string;
  readonly info: MaterialsInfo;
  readonly dataForm?: MaterialsForm;
  readonly thumb?: string;
  readonly preview?: string;
  readonly onEvents?: MaterialsCustomEvent[];
  readonly emitEvents?: MaterialsCustomEvent[];
  readonly isBuildIn?: boolean;
}

export interface PluginInstance {
  key: Readonly<number>;
  plugin: Readonly<string>;
  data: { [key: string]: any };
  events: EventInstance[];
}

// TODO
export interface PluginParams {
  data: object;
}

export type MaterialsPlugin = (params: PluginParams) => void;
