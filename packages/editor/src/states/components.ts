import { action, computed, observable, toJS } from 'mobx';
import { ComponentInstance, ComponentPosition, ComponentSize, LayoutMode } from 'types';
import { pagesStore } from './pages';
import { materialsStore } from './materials';
import {
    addPageComponentInstanceMap,
    batchUpdateCurrentPageComponentIndex,
    createComponentInstance,
    deleteCurrentPageComponentIndex,
    deletePageComponentInstanceMap,
    findComponentInstanceByIndex,
    getCurrentPageComponentIndex,
    getMaxNodeBottomOffset,
    injectGlobalReadonlyGetter,
    isNumber,
    setCurrentPageComponentIndex,
} from '../utils';
import { selectStore } from './select';
import { globalStore } from './global';
// import { withHistory } from './history';

export class ComponentsStore {
    /**
     * @desc PageComponentsMap
     * @struct Map<Page, ComponentInstance[]>
     */
    @observable
    private pagesComponentInstancesMap: {
        [key: number]: ComponentInstance[];
    } = {};

    @computed
    public get componentInstances(): ComponentInstance[] {
        return this.pagesComponentInstancesMap[pagesStore.currentPage.key];
    }

    @action
    public addComponentInstancesMap = (pageKey: number) => {
        this.pagesComponentInstancesMap[pageKey] = [];
        addPageComponentInstanceMap(pageKey);
    };

    @action
    public deleteComponentInstancesMap = (pageKey: number) => {
        delete this.pagesComponentInstancesMap[pageKey];
        deletePageComponentInstanceMap(pageKey);
    };

    /**
     * @desc ComponentInstances
     * @struct ComponentInstance[]
     */
    @action
    public addComponentInstance = (componentID: string) => {
        const component = materialsStore.components[componentID];
        const instance =
            globalStore.layoutMode === LayoutMode.FREE
                ? createComponentInstance(component, true, getMaxNodeBottomOffset(this.componentInstances))
                : createComponentInstance(component, false);

        if (selectStore.containerComponentKey > -1) {
            return this.addComponentInstanceAsChildren(instance);
        }

        const instances = this.pagesComponentInstancesMap[pagesStore.currentPage.key];
        instances.push(instance);

        setCurrentPageComponentIndex(instance.key, [instances.length - 1]);
        selectStore.selectComponent(instance.key);
    };

    @action
    private addComponentInstanceAsChildren = (instance: ComponentInstance) => {
        const instances = this.pagesComponentInstancesMap[pagesStore.currentPage.key];
        const [index] = getCurrentPageComponentIndex(selectStore.componentKey)!;
        instances[index]!.children!.push(instance);

        setCurrentPageComponentIndex(instance.key, [index, instances.length - 1]);
        selectStore.selectComponent(instance.key);
    };

    @action
    public deleteComponentInstance = (key: number) => {
        let instances = this.pagesComponentInstancesMap[pagesStore.currentPage.key];
        const [index, parentIndex] = deleteCurrentPageComponentIndex(key, instances);

        if (isNumber(parentIndex)) {
            instances = instances[parentIndex!].children!;
        }

        instances.splice(index, 1);
        selectStore.selectPage(selectStore.pageIndex);
    };

    @action
    public resortComponentInstance = (key: number, oldIndex: number, newIndex: number) => {
        if (oldIndex === newIndex) {
            return;
        }

        const instances = this.pagesComponentInstancesMap[pagesStore.currentPage.key];

        const [index, childIndex] = getCurrentPageComponentIndex(key)!;
        if (isNumber(childIndex)) {
            const childrenInstances = instances[index]!.children!;
            const [childInstance] = childrenInstances.splice(oldIndex, 1);
            childrenInstances.splice(newIndex, 0, childInstance);
            return batchUpdateCurrentPageComponentIndex(childrenInstances, oldIndex, newIndex, true);
        }

        const [instance] = instances.splice(oldIndex, 1);
        instances.splice(newIndex, 0, instance);
        return batchUpdateCurrentPageComponentIndex(instances, oldIndex, newIndex);
    };

    @action
    public moveComponentInstance = (key: number, position: ComponentPosition) => {
        const instance = findComponentInstanceByIndex(
            this.pagesComponentInstancesMap[pagesStore.currentPage.key],
            getCurrentPageComponentIndex(key)!,
        );
        instance.layout!.position = position;
    };

    @action
    public resizeComponentInstance = (key: number, position: ComponentPosition, size: ComponentSize) => {
        const instance = findComponentInstanceByIndex(
            this.pagesComponentInstancesMap[pagesStore.currentPage.key],
            getCurrentPageComponentIndex(key)!,
        );
        instance.layout = {
            position,
            size,
        };
    };
}

export const componentsStore = new ComponentsStore();

injectGlobalReadonlyGetter('vize_components_store', () => toJS(componentsStore));
