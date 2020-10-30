import { action, observable, computed, toJS, runInAction } from 'mobx';
import { Maybe } from 'types';
import { setMaterialsMetaMap } from 'runtime';
import { loadMaterials, injectGlobalReadonlyGetter, isDev } from '../utils';
import { editStore } from './edit';

interface MaterialsLibItem {
  readonly isMainLib: boolean;
  readonly libName: string;
  readonly containerHTML: Maybe<string>;
  readonly mainScript: string;
  readonly mainStyle: Maybe<string>;
  readonly mainEntryName: string;
  readonly entryScript: Maybe<string>;
  readonly entryStyle: Maybe<string>;
  readonly entryEntryName: Maybe<string>;
}

export class MaterialsStore {
  @action
  public readonly init = () => {
    const { libNames, debugPorts } = editStore;
    return Promise.all(
      libNames.map((name, index) => {
        return this.loadMaterials(name, debugPorts[index]);
      }),
    );
  };

  @observable
  public materialsLibs: { [libName: string]: MaterialsLibItem } = {};

  @computed
  public get mainMaterialsLib() {
    return this.materialsLibs[editStore.mainLib];
  }

  @computed
  public get containerHTML(): string {
    const { containerHTML = '' } = this.materialsLibs[editStore.mainLib]!;
    return containerHTML!;
  }

  @action
  private readonly loadMaterials = async (libName: string, debugPort?: number): Promise<void> => {
    const {
      containerHTML,
      meta,
      main: { script: mainScript, style: mainStyle, entryName: mainEntryName },
      entry: { script: entryScript, style: entryStyle, entryName: entryEntryName },
    } = await loadMaterials(libName, debugPort || undefined);

    setMaterialsMetaMap(libName, meta);

    runInAction(() => {
      const isMainLib = editStore.mainLib === libName;

      this.materialsLibs[libName] = {
        isMainLib,
        libName,
        containerHTML: isMainLib ? containerHTML : null,
        mainScript,
        mainStyle,
        mainEntryName,
        entryScript: isMainLib ? entryScript : null,
        entryStyle: isMainLib ? entryStyle : null,
        entryEntryName: isMainLib ? entryEntryName : null,
      };
    });
  };
}

export const materialsStore = new MaterialsStore();

if (isDev()) {
  setTimeout(() => injectGlobalReadonlyGetter('vize_materials_store', () => toJS(materialsStore)), 1000);
}
