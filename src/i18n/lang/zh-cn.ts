// 定义内容
export default {
	router: {
		home: '首页',
		mainHead: '治工具系统',
		basics: '基本资料维护',
		basicsPurchase: '采购群组',
		basicsObject: '工程群组',
		basicsBasic: '基础数据',
		basicsCode: '机种与专案代码',
		taskList: '任务列表',
		menu1: '菜单1',
		menu2: '菜单2',
		requisition: '请购管理',
		presentation: '治工具请购作业',
		arrivejob: '到货作业',
		entryjob: '请购入库',
		toolsReturn: '治工具退库',
		report: '报表管理',
		matNo: '料号管理',
		matSearch: '料号新增/查询',
		matSample: '送样需求提报',
		sampleReceive: '样品收货',
		sampleAcceptance: '样品验收',
		presentationSearch: '治工具请购查询',
		maintenanceManage: '维修管理',
		maintenanceInquiry: '维修单查询',
		maintenancePresent: '维修单提报',
		maintenanceDelivery: '维修单收货',
		unusedManage: '闲置管理',
		unusedInquiry: '闲置查询',
		unusedOrderSub: '闲置单提报',
		arrivalAcceptance: '到货验收',
		inventoryManage:'库存管理',
		inventoryInquiry:'库存查询',
		maintenanceWarehouse:'维修入库',
		returnTools:'治工具退库',
		scrapManage:'报废管理',
		scrapBillQuery:'报废单查询',
		scrapSheetSub:'报废单提报',
		repairOrderAcceptance:'维修单验收',
		warehouseManage:'仓库管理',
		transferReceipt:'转仓接收',
		purchaseSampleDelivery:'采购送样',
		reportManagement:'报表管理',
		sampleDeliveryList:'送样清单',
		idleList:'治工具闲置清单',
		maintenanceList:'治工具维修清单',
		acceptanceList:'治工具验收清单',
		scrapList:'治工具报废清单',
		numberOnRecord:'治工具在册数量清单',
		drawingList:'治工具图纸清单'
	},
	staticRoutes: {
		signIn: '登录',
		notFound: '找不到此页面',
		noPower: '没有权限',
	},
	user: {
		title0: '组件大小',
		title1: '语言切换',
		title2: '菜单搜索',
		title3: '布局配置',
		title4: '消息',
		title5: '开全屏',
		title6: '关全屏',
		dropdownLarge: '大型',
		dropdownDefault: '默认',
		dropdownSmall: '小型',
		dropdown1: '首页',
		dropdown2: '个人中心',
		dropdown3: '404',
		dropdown4: '401',
		dropdown5: '退出登录',
		dropdown6: '代码仓库',
		searchPlaceholder: '菜单搜索：支持中文、路由路径',
		newTitle: '通知',
		newBtn: '全部已读',
		newGo: '前往通知中心',
		newDesc: '暂无通知',
		logOutTitle: '提示',
		logOutMessage: '此操作将退出登录, 是否继续?',
		logOutConfirm: '确定',
		logOutCancel: '取消',
		logOutExit: '退出中',
	},
	tagsView: {
		refresh: '刷新',
		close: '关闭当前',
		closeOther: '关闭其它',
		closeAll: '全部关闭',
		fullscreen: '当前页全屏',
		closeFullscreen: '关闭全屏',
	},
	notFound: {
		foundTitle: '地址输入错误，请重新输入地址~',
		foundMsg: '您可以先检查网址，然后重新输入或给我们反馈问题。',
		foundBtn: '返回首页',
	},
	noAccess: {
		accessTitle: '您未被授权，没有操作权限~',
		accessMsg: '联系方式：加QQ群探讨 665452019',
		accessBtn: '重新授权',
	},
	layout: {
		configTitle: '布局配置',
		oneTitle: '全局主题',
		twoTopTitle: '顶栏设置',
		twoMenuTitle: '菜单设置',
		twoColumnsTitle: '分栏设置',
		twoTopBar: '顶栏背景',
		twoTopBarColor: '顶栏默认字体颜色',
		twoIsTopBarColorGradual: '顶栏背景渐变',
		twoMenuBar: '菜单背景',
		twoMenuBarColor: '菜单默认字体颜色',
		twoMenuBarActiveColor: '菜单高亮背景色',
		twoIsMenuBarColorGradual: '菜单背景渐变',
		twoColumnsMenuBar: '分栏菜单背景',
		twoColumnsMenuBarColor: '分栏菜单默认字体颜色',
		twoIsColumnsMenuBarColorGradual: '分栏菜单背景渐变',
		twoIsColumnsMenuHoverPreload: '分栏菜单鼠标悬停预加载',
		threeTitle: '界面设置',
		threeIsCollapse: '菜单水平折叠',
		threeIsUniqueOpened: '菜单手风琴',
		threeIsFixedHeader: '固定 Header',
		threeIsClassicSplitMenu: '经典布局分割菜单',
		threeIsLockScreen: '开启锁屏',
		threeLockScreenTime: '自动锁屏(s/秒)',
		fourTitle: '界面显示',
		fourIsShowLogo: '侧边栏 Logo',
		fourIsBreadcrumb: '开启 Breadcrumb',
		fourIsBreadcrumbIcon: '开启 Breadcrumb 图标',
		fourIsTagsview: '开启 Tagsview',
		fourIsTagsviewIcon: '开启 Tagsview 图标',
		fourIsCacheTagsView: '开启 TagsView 缓存',
		fourIsSortableTagsView: '开启 TagsView 拖拽',
		fourIsShareTagsView: '开启 TagsView 共用',
		fourIsFooter: '开启 Footer',
		fourIsGrayscale: '灰色模式',
		fourIsInvert: '色弱模式',
		fourIsDark: '深色模式',
		fourIsWartermark: '开启水印',
		fourWartermarkText: '水印文案',
		fiveTitle: '其它设置',
		fiveTagsStyle: 'Tagsview 风格',
		fiveAnimation: '主页面切换动画',
		fiveColumnsAsideStyle: '分栏高亮风格',
		fiveColumnsAsideLayout: '分栏布局风格',
		sixTitle: '布局切换',
		sixDefaults: '默认',
		sixClassic: '经典',
		sixTransverse: '横向',
		sixColumns: '分栏',
		tipText: '点击下方按钮，复制布局配置去 `src/stores/themeConfig.ts` 中修改。',
		copyText: '一键复制配置',
		resetText: '一键恢复默认',
		copyTextSuccess: '复制成功！',
		copyTextError: '复制失败！',
	},
};
