import Vue from 'vue';
import Router from 'vue-router';

import MainPage from 'components/MainPage';
import MetaData from 'components/MetaData/MetaData';
import SearchResult from 'components/MetaData/SearchResult';
import Search from 'components/MetaData/Search';
import Dataset from 'components/MetaData/Dataset/Dataset';
import DatasetDetail from 'components/MetaData/Dataset/DatasetDetail';

import Personal from 'components/MetaData/Personal/Personal';
import PersonalCollect from 'components/MetaData/Personal/PersonalCollect';
import PersonalAuthority from 'components/MetaData/Personal/PersonalAuthority';
import PersonalOwner from 'components/MetaData/Personal/PersonalOwner';
import PersonalRecord from 'components/MetaData/Personal/PersonalRecord';
import PersonalApproval from 'components/MetaData/Personal/PersonalApproval';
import PersonalDel from 'components/MetaData/Personal/PersonalDel';
import Setting from 'components/MetaData/Personal/Setting';
import Tag from 'components/MetaData/Personal/Tag';

/*
*
* 导入/导出模块
*
* */
import ImportExport from 'components/ImportExport/Index';    //主页

/*
* 一级菜单
* */
import Collection from 'components/ImportExport/children/Collection';
import ExportModule from 'components/ImportExport/children/Export';
import ImportModule from 'components/ImportExport/children/Import';

/*
* 二级菜单
* */
import DataImport from 'components/ImportExport/children/children/DataImport';
import TaskList from 'components/ImportExport/children/children/TaskList';
import CreateTask from 'components/ImportExport/children/children/CreateTask';
import HistoryList from 'components/ImportExport/children/children/HistoryList';
import InsertData from 'components/ImportExport/children/children/InsertData';
import CompleteData from 'components/ImportExport/children/children/CompleteData';

import Source from 'components/Source/Source';
import SourceHome from 'components/Source/SourceHome';
import SourceDataset from 'components/Source/Detail/SourceDataset';
import SourceDatabase from 'components/Source/Detail/SourceDatabase';
import NumberRecord from 'components/Source/Detail/NumberRecord';

import Home from 'components/Home/Home';
import HomeIndex from 'components/Home/HomeIndex';

import Files from 'components/Files/Index';

import Business from 'components/Business/Index';

Vue.use(Router);
let routes = [
    {path: '/', redirect: '/Main'},
    {path: '', redirect: '/'},
    {path: '/index.html', redirect: '/'},
    {
        path: '/Main', name: 'Main', component: MainPage,
        children: [
            {path: '', redirect: 'MetaData'},
            {
                path: 'MetaData', name: 'MetaData', component: MetaData, redirect: {name: 'Home'},
                children: [
                    {path: '', redirect: {name: 'Home'}},
                    {
                        path: 'Home',
                        name: 'Home',
                        component: Home,
                        redirect: {name: 'HomeIndex'},
                        children: [
                            {path: 'HomeIndex', name: 'HomeIndex', component: HomeIndex},
                            {path: 'Search', name: 'Search', component: Search}
                        ]
                    },
                    {path: 'SearchResult', name: 'SearchResult', component: SearchResult},
                    {
                        path: 'Physical', name: 'Physical', component: Dataset,
                        children: [
                            {path: '', redirect: 'PhysicalDetail'},
                            {path: 'PhysicalDetail', name: 'PhysicalDetail', component: DatasetDetail}
                        ]
                    },
                    {
                        path: 'Personal',
                        component: Personal,
                        name: 'Personal',
                        children: [
                            {path: '', redirect: 'Owner'},
                            {path: 'Collect', name: 'Collect', component: PersonalCollect},
                            {path: 'Authority', name: 'Authority', component: PersonalAuthority},
                            {path: 'Owner', name: 'Owner', component: PersonalOwner},
                            {path: 'Applys', name: 'Applys', component: PersonalRecord},
                            {path: 'Approvals', name: 'Approvals', component: PersonalApproval},
                            {path: 'Deleted', name: 'Deleted', component: PersonalDel},
                            {path: 'Setting', name: 'Setting', component: Setting},
                            {
                                path: 'Tag/:id?', component: Tag, name: 'Tag'
                            }
                        ]
                    }
                ]
            },
            {
                path: 'Files',
                component: Files,
                name: 'Files'
            },
            {
                path: 'Business',
                component: Business,
                name: 'Business'
            },
            {
                path: 'ImportExport', component: ImportExport, name: 'ImportExport',
                children: [
                    {
                        path: 'Collection', name: 'Collection', component: Collection,
                        children: [
                            {path: '', redirect: 'TaskList'},
                            {path: 'TaskList', name: 'TaskList', component: TaskList},
                            {path: 'CreateTask/:id?', name: 'CreateTask', component: CreateTask},
                            {path: 'HistoryList/:id', name: 'HistoryList', component: HistoryList},
                            {path: 'InsertData/:id', name: 'InsertData', component: InsertData},
                            {path: 'CompleteData/:id', name: 'CompleteData', component: CompleteData}
                        ]
                    },
                    {
                        path: 'ImportModule', name: 'ImportModule', component: ImportModule,
                        children: [
                            {path: 'DataImport', component: DataImport, name: 'DataImport'}
                        ]
                    },
                    {path: 'ExportModule', name: 'ExportModule', component: ExportModule}
                ]
            },
            {
                path: 'Source', component: Source, name: 'Source',
                children: [
                    {path: 'SourceHome', name: 'SourceHome', component: SourceHome},
                    {path: 'SourceDataset', name: 'SourceDataset', component: SourceDataset},
                    {path: 'SourceDatabase', name: 'SourceDatabase', component: SourceDatabase},
                    {path: 'NumberRecord', name: 'NumberRecord', component: NumberRecord}
                ]
            }
        ]
    }
];
export default new Router({
    routes
});
