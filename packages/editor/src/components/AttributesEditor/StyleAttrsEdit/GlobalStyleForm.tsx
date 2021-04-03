import * as React from 'react';
import { useCallback } from 'react';
import { observer } from 'mobx-react';
import { getMaterialsContainerMeta, EventEmitTypes, events } from 'libs';
import { globalStore } from 'states';
import { i18n } from 'i18n';
import { Empty } from 'widgets/Empty';
import { SchemaForm } from 'widgets/Form';

function IGlobalDataForm() {
  const { globalStyleForm } = getMaterialsContainerMeta()!;
  const { globalStyle, setGlobalStyle } = globalStore;

  const onChange = useCallback((v: object) => {
    setGlobalStyle(v);
    events.emit(EventEmitTypes.RELOAD_RENDERER);
  }, []);

  if (!globalStyleForm) {
    return <Empty text={i18n.t('Not available')} />;
  }

  return (
    <div className="editor-prop-item editor-prop-edit-style">
      <SchemaForm form={globalStyleForm} data={globalStyle} onChange={onChange} submitProps />
    </div>
  );
}

export const GlobalStyleForm = observer(IGlobalDataForm);
