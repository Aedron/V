import 'styles/override.less';
import 'styles/index.scss';
import * as React from 'react';
import { Route, Switch } from 'wouter';
import { LeftBar } from 'components/LeftBar';
import { RouterPaths } from 'types';
import { Intro } from 'pages/intro';
import { Pages } from 'pages/pages';
import { Templates } from 'pages/templates';
import { Materials, MaterialsDetail } from 'pages/materials';
import { Bizs } from 'pages/bizs';
import { Users } from 'pages/users';

export function App() {
  return (
    <>
      <LeftBar />

      <div className="vize-main">
        <Switch>
          <Route path={RouterPaths.INTRO} component={Intro} />
          <Route path={RouterPaths.PAGES} component={Pages} />
          <Route path={RouterPaths.TEMPLATES} component={Templates} />
          <Route path={RouterPaths.MATERIALS_LIB} component={Materials} />
          <Route path={RouterPaths.MATERIALS_DETAIL} component={MaterialsDetail} />
          <Route path={RouterPaths.BIZ} component={Bizs} />
          <Route path={RouterPaths.USER} component={Users} />
        </Switch>
      </div>
    </>
  );
}
