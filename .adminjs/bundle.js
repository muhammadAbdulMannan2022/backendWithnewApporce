(function (React, adminjs, designSystem) {
  'use strict';

  function _interopDefault (e) { return e && e.__esModule ? e : { default: e }; }

  var React__default = /*#__PURE__*/_interopDefault(React);

  const ErrorBarChart = ({
    stats
  }) => {
    if (!stats || stats.length === 0) return /*#__PURE__*/React__default.default.createElement("div", null, "No error data available");
    const maxCount = Math.max(...stats.map(s => s.count), 5);
    return /*#__PURE__*/React__default.default.createElement("div", {
      style: {
        flex: 2,
        background: '#fff',
        padding: '24px',
        borderRadius: '16px',
        boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)',
        border: '1px solid #f1f5f9'
      }
    }, /*#__PURE__*/React__default.default.createElement("h3", {
      style: {
        margin: '0 0 20px 0',
        color: '#1e293b',
        fontSize: '16px',
        fontWeight: '700'
      }
    }, "Error Frequency (7 Days)"), /*#__PURE__*/React__default.default.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'space-between',
        height: '180px',
        gap: '8px',
        paddingTop: '20px'
      }
    }, stats.map(s => {
      const height = s.count / maxCount * 100;
      return /*#__PURE__*/React__default.default.createElement("div", {
        key: s.day,
        style: {
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          height: '100%'
        }
      }, /*#__PURE__*/React__default.default.createElement("div", {
        style: {
          flex: 1,
          width: '100%',
          display: 'flex',
          alignItems: 'flex-end'
        }
      }, /*#__PURE__*/React__default.default.createElement("div", {
        style: {
          width: '100%',
          height: `${Math.max(height, 2)}%`,
          background: s.count > 0 ? 'linear-gradient(to top, #6366f1, #a5b4fc)' : '#f1f5f9',
          borderRadius: '6px 6px 2px 2px',
          transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
          position: 'relative'
        }
      }, s.count > 0 && /*#__PURE__*/React__default.default.createElement("span", {
        style: {
          position: 'absolute',
          top: '-25px',
          left: '50%',
          transform: 'translateX(-50%)',
          fontSize: '11px',
          fontWeight: '700',
          color: '#6366f1'
        }
      }, s.count))), /*#__PURE__*/React__default.default.createElement("div", {
        style: {
          fontSize: '10px',
          color: '#94a3b8',
          marginTop: '12px',
          fontWeight: '500'
        }
      }, s.day.split('-').slice(2)));
    })));
  };
  const FlowDonutChart = ({
    stats
  }) => {
    if (!stats || stats.length === 0) return null;
    const total = stats.reduce((acc, curr) => acc + curr.count, 0);
    let cumulative = 0;
    const colors = ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];
    const gradientParts = stats.map((s, i) => {
      const start = cumulative / total * 100;
      const end = (cumulative + s.count) / total * 100;
      cumulative += s.count;
      return `${colors[i % colors.length]} ${start}% ${end}%`;
    });
    return /*#__PURE__*/React__default.default.createElement("div", {
      style: {
        flex: 1,
        background: '#fff',
        padding: '24px',
        borderRadius: '16px',
        boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)',
        border: '1px solid #f1f5f9'
      }
    }, /*#__PURE__*/React__default.default.createElement("h3", {
      style: {
        margin: '0 0 20px 0',
        color: '#1e293b',
        fontSize: '16px',
        fontWeight: '700'
      }
    }, "Errors by Flow"), /*#__PURE__*/React__default.default.createElement("div", {
      style: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
      }
    }, /*#__PURE__*/React__default.default.createElement("div", {
      style: {
        width: '140px',
        height: '140px',
        borderRadius: '50%',
        background: `conic-gradient(${gradientParts.join(', ')})`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        marginBottom: '20px'
      }
    }, /*#__PURE__*/React__default.default.createElement("div", {
      style: {
        width: '100px',
        height: '100px',
        background: '#fff',
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        flexDirection: 'column',
        justifyContent: 'center'
      }
    }, /*#__PURE__*/React__default.default.createElement("span", {
      style: {
        fontSize: '24px',
        fontWeight: '800',
        color: '#1e293b'
      }
    }, total), /*#__PURE__*/React__default.default.createElement("span", {
      style: {
        fontSize: '10px',
        color: '#64748b',
        textTransform: 'uppercase'
      }
    }, "Total"))), /*#__PURE__*/React__default.default.createElement("div", {
      style: {
        width: '100%'
      }
    }, stats.map((s, i) => /*#__PURE__*/React__default.default.createElement("div", {
      key: s.name,
      style: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '8px'
      }
    }, /*#__PURE__*/React__default.default.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: '8px'
      }
    }, /*#__PURE__*/React__default.default.createElement("div", {
      style: {
        width: '8px',
        height: '8px',
        borderRadius: '50%',
        background: colors[i % colors.length]
      }
    }), /*#__PURE__*/React__default.default.createElement("span", {
      style: {
        fontSize: '12px',
        color: '#475569',
        maxWidth: '100px',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap'
      }
    }, s.name)), /*#__PURE__*/React__default.default.createElement("span", {
      style: {
        fontSize: '12px',
        fontWeight: '700',
        color: '#1e293b'
      }
    }, Math.round(s.count / total * 100), "%"))))));
  };
  const EndpointRanking = ({
    stats
  }) => {
    if (!stats || stats.length === 0) return null;
    const max = stats[0].count;
    return /*#__PURE__*/React__default.default.createElement("div", {
      style: {
        background: '#fff',
        padding: '24px',
        borderRadius: '16px',
        boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)',
        border: '1px solid #f1f5f9',
        marginTop: '20px'
      }
    }, /*#__PURE__*/React__default.default.createElement("h3", {
      style: {
        margin: '0 0 20px 0',
        color: '#1e293b',
        fontSize: '16px',
        fontWeight: '700'
      }
    }, "Top Problematic Endpoints"), stats.map((s, i) => /*#__PURE__*/React__default.default.createElement("div", {
      key: s.name,
      style: {
        marginBottom: '16px'
      }
    }, /*#__PURE__*/React__default.default.createElement("div", {
      style: {
        display: 'flex',
        justifyContent: 'space-between',
        marginBottom: '6px'
      }
    }, /*#__PURE__*/React__default.default.createElement("span", {
      style: {
        fontSize: '13px',
        fontWeight: '600',
        color: '#475569'
      }
    }, s.name), /*#__PURE__*/React__default.default.createElement("span", {
      style: {
        fontSize: '13px',
        fontWeight: '700',
        color: '#1e293b'
      }
    }, s.count, " errors")), /*#__PURE__*/React__default.default.createElement("div", {
      style: {
        width: '100%',
        height: '8px',
        background: '#f1f5f9',
        borderRadius: '4px',
        overflow: 'hidden'
      }
    }, /*#__PURE__*/React__default.default.createElement("div", {
      style: {
        width: `${s.count / max * 100}%`,
        height: '100%',
        background: 'linear-gradient(90deg, #ef4444, #f87171)',
        borderRadius: '4px',
        transition: 'width 1s ease-out'
      }
    })))));
  };
  const Overview = props => {
    const [data, setData] = React.useState(props.data || {});
    const [loading, setLoading] = React.useState(!props.data || !props.data.flowStats);
    const api = new adminjs.ApiClient();
    React.useEffect(() => {
      if (!props.data || !props.data.flowStats) {
        setLoading(true);
        api.getDashboard().then(response => {
          setData(response.data);
          setLoading(false);
        }).catch(err => {
          console.error('Error fetching dashboard data:', err);
          setLoading(false);
        });
      }
    }, [props.data]);
    if (loading) {
      return /*#__PURE__*/React__default.default.createElement("div", {
        style: {
          padding: '60px',
          textAlign: 'center',
          background: '#f8fafc',
          minHeight: '100vh'
        }
      }, /*#__PURE__*/React__default.default.createElement("div", {
        style: {
          display: 'inline-block',
          width: '40px',
          height: '40px',
          border: '3px solid #e2e8f0',
          borderTopColor: '#6366f1',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite'
        }
      }), /*#__PURE__*/React__default.default.createElement("style", null, `@keyframes spin { to { transform: rotate(360deg); } }`), /*#__PURE__*/React__default.default.createElement("h2", {
        style: {
          color: '#1e293b',
          marginTop: '20px'
        }
      }, "Loading Intelligence..."));
    }
    return /*#__PURE__*/React__default.default.createElement("div", {
      style: {
        padding: '40px',
        background: '#f8fafc',
        minHeight: '100vh',
        fontFamily: "'Inter', sans-serif"
      }
    }, /*#__PURE__*/React__default.default.createElement("div", {
      style: {
        maxWidth: '1200px',
        margin: '0 auto'
      }
    }, /*#__PURE__*/React__default.default.createElement("div", {
      style: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: '40px'
      }
    }, /*#__PURE__*/React__default.default.createElement("div", null, /*#__PURE__*/React__default.default.createElement("h1", {
      style: {
        color: '#1e293b',
        fontSize: '28px',
        fontWeight: '800',
        margin: '0 0 8px 0'
      }
    }, "System Health Dashboard"), /*#__PURE__*/React__default.default.createElement("p", {
      style: {
        color: '#64748b',
        fontSize: '16px'
      }
    }, "Real-time error analysis and traffic distribution.")), /*#__PURE__*/React__default.default.createElement("div", {
      style: {
        background: '#fff',
        padding: '8px 16px',
        borderRadius: '10px',
        boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
        display: 'flex',
        alignItems: 'center',
        gap: '8px'
      }
    }, /*#__PURE__*/React__default.default.createElement("div", {
      style: {
        width: '8px',
        height: '8px',
        background: '#22c55e',
        borderRadius: '50%',
        boxShadow: '0 0 6px #22c55e'
      }
    }), /*#__PURE__*/React__default.default.createElement("span", {
      style: {
        fontSize: '13px',
        fontWeight: '600',
        color: '#1e293b'
      }
    }, "Live Mode"))), /*#__PURE__*/React__default.default.createElement("div", {
      style: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '24px',
        marginBottom: '32px'
      }
    }, [{
      label: 'Active Users',
      value: data.userCount,
      color: '#6366f1'
    }, {
      label: 'Messages Processed',
      value: data.messageCount,
      color: '#10b981'
    }, {
      label: 'Incidents logged',
      value: data.errorCount,
      color: '#ef4444',
      isDanger: true
    }].map(card => /*#__PURE__*/React__default.default.createElement("div", {
      key: card.label,
      style: {
        background: '#fff',
        padding: '24px',
        borderRadius: '16px',
        boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)',
        position: 'relative',
        overflow: 'hidden'
      }
    }, /*#__PURE__*/React__default.default.createElement("div", {
      style: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: '4px',
        height: '100%',
        background: card.color
      }
    }), /*#__PURE__*/React__default.default.createElement("div", {
      style: {
        color: '#64748b',
        fontSize: '12px',
        fontWeight: '700',
        textTransform: 'uppercase',
        letterSpacing: '0.5px'
      }
    }, card.label), /*#__PURE__*/React__default.default.createElement("div", {
      style: {
        fontSize: '32px',
        fontWeight: '800',
        color: '#1e293b',
        marginTop: '8px'
      }
    }, card.value ?? 0)))), /*#__PURE__*/React__default.default.createElement("div", {
      style: {
        display: 'flex',
        gap: '24px',
        flexWrap: 'wrap'
      }
    }, /*#__PURE__*/React__default.default.createElement(ErrorBarChart, {
      stats: data.errorStats
    }), /*#__PURE__*/React__default.default.createElement(FlowDonutChart, {
      stats: data.flowStats
    })), /*#__PURE__*/React__default.default.createElement(EndpointRanking, {
      stats: data.endpointStats
    }), /*#__PURE__*/React__default.default.createElement("div", {
      style: {
        marginTop: '40px',
        textAlign: 'center',
        color: '#94a3b8',
        fontSize: '13px'
      }
    }, "Lantana Monitoring Engine v2.0 \u2022 Last Sync: ", new Date().toLocaleTimeString())));
  };

  const ResourceHeader = props => {
    const {
      resource,
      action
    } = props;
    const stats = action.meta?.stats || {};
    const resourceName = resource.name;

    // Render different icons/colors based on resource
    const getResourceConfig = () => {
      switch (resourceName) {
        case 'User':
          return {
            color: '#6366f1',
            icon: 'User',
            label: 'User Analytics'
          };
        case 'Errors':
          return {
            color: '#ef4444',
            icon: 'Warning',
            label: 'Error Intelligence'
          };
        case 'Message':
          return {
            color: '#10b981',
            icon: 'Email',
            label: 'Communication Stats'
          };
        case 'Room':
          return {
            color: '#f59e0b',
            icon: 'Chat',
            label: 'Room Activity'
          };
        default:
          return {
            color: '#6366f1',
            icon: 'Activity',
            label: 'Overview'
          };
      }
    };
    const config = getResourceConfig();
    return /*#__PURE__*/React__default.default.createElement(designSystem.Box, {
      variant: "white",
      padding: "xl",
      marginBottom: "xl",
      borderRadius: "lg",
      boxShadow: "card"
    }, /*#__PURE__*/React__default.default.createElement(designSystem.Box, {
      flex: true,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      marginBottom: "xl"
    }, /*#__PURE__*/React__default.default.createElement(designSystem.Box, {
      flex: true,
      flexDirection: "row",
      alignItems: "center",
      gap: "lg"
    }, /*#__PURE__*/React__default.default.createElement(designSystem.Box, {
      backgroundColor: config.color,
      padding: "md",
      borderRadius: "md",
      color: "white",
      display: "flex",
      alignItems: "center",
      justifyContent: "center"
    }, /*#__PURE__*/React__default.default.createElement("svg", {
      width: "24",
      height: "24",
      viewBox: "0 0 24 24",
      fill: "none",
      stroke: "currentColor",
      strokeWidth: "2",
      strokeLinecap: "round",
      strokeLinejoin: "round"
    }, resourceName === 'User' && /*#__PURE__*/React__default.default.createElement(React__default.default.Fragment, null, /*#__PURE__*/React__default.default.createElement("path", {
      d: "M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"
    }), /*#__PURE__*/React__default.default.createElement("circle", {
      cx: "12",
      cy: "7",
      r: "4"
    })), resourceName === 'Errors' && /*#__PURE__*/React__default.default.createElement(React__default.default.Fragment, null, /*#__PURE__*/React__default.default.createElement("path", {
      d: "m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"
    }), /*#__PURE__*/React__default.default.createElement("path", {
      d: "M12 9v4"
    }), /*#__PURE__*/React__default.default.createElement("path", {
      d: "M12 17h.01"
    })), resourceName === 'Message' && /*#__PURE__*/React__default.default.createElement(React__default.default.Fragment, null, /*#__PURE__*/React__default.default.createElement("path", {
      d: "M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"
    }), /*#__PURE__*/React__default.default.createElement("polyline", {
      points: "22,6 12,13 2,6"
    })), resourceName === 'Room' && /*#__PURE__*/React__default.default.createElement("path", {
      d: "M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"
    }))), /*#__PURE__*/React__default.default.createElement(designSystem.Box, null, /*#__PURE__*/React__default.default.createElement(designSystem.H3, {
      marginBottom: "0",
      color: "grey100"
    }, config.label), /*#__PURE__*/React__default.default.createElement(designSystem.Text, {
      size: "sm",
      color: "grey60"
    }, resourceName, " management and real-time monitoring")))), /*#__PURE__*/React__default.default.createElement(designSystem.Box, {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
      gap: "lg"
    }, Object.entries(stats).map(([label, value]) => /*#__PURE__*/React__default.default.createElement(designSystem.Box, {
      key: label,
      padding: "lg",
      backgroundColor: "grey20",
      borderRadius: "md",
      border: `1px solid #e2e8f0`
    }, /*#__PURE__*/React__default.default.createElement(designSystem.Text, {
      color: "grey60",
      size: "xs",
      fontWeight: "bold",
      textTransform: "uppercase",
      letterSpacing: "wider"
    }, label.replace(/([A-Z])/g, ' $1')), /*#__PURE__*/React__default.default.createElement(designSystem.Text, {
      color: "grey100",
      size: "xl",
      fontWeight: "800",
      marginTop: "sm"
    }, value)))));
  };

  const ResourceList = props => {
    const {
      resource,
      action
    } = props;
    const [data, setData] = React.useState([]);
    const [loading, setLoading] = React.useState(true);
    const [meta, setMeta] = React.useState({});
    const [page, setPage] = React.useState(1);
    const api = new adminjs.ApiClient();
    const sendNotice = adminjs.useNotice();
    const fetchData = async (pageNum = 1) => {
      setLoading(true);
      try {
        const response = await api.resourceAction({
          resourceId: resource.id,
          actionName: 'list',
          params: {
            page: pageNum
          }
        });
        setData(response.data.records);
        setMeta(response.data.meta);
        setPage(pageNum);
      } catch (err) {
        sendNotice({
          message: 'Error fetching data',
          type: 'error'
        });
      } finally {
        setLoading(false);
      }
    };
    React.useEffect(() => {
      fetchData();
    }, [resource.id]);
    const onPageChange = newPage => {
      fetchData(newPage);
    };
    return /*#__PURE__*/React__default.default.createElement(designSystem.Box, {
      padding: "xl"
    }, /*#__PURE__*/React__default.default.createElement(ResourceHeader, props), /*#__PURE__*/React__default.default.createElement(designSystem.Box, {
      variant: "white",
      padding: "xl",
      borderRadius: "lg",
      boxShadow: "card"
    }, /*#__PURE__*/React__default.default.createElement(designSystem.Box, {
      flex: true,
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: "xl"
    }, /*#__PURE__*/React__default.default.createElement(designSystem.H3, null, resource.name, " List"), /*#__PURE__*/React__default.default.createElement(designSystem.Button, {
      variant: "primary",
      onClick: () => window.location.href = `${window.location.origin}/admin/resources/${resource.id}/actions/new`
    }, /*#__PURE__*/React__default.default.createElement(designSystem.Icon, {
      icon: "Add"
    }), "Create New")), loading ? /*#__PURE__*/React__default.default.createElement(designSystem.Box, {
      flex: true,
      justifyContent: "center",
      padding: "xl"
    }, /*#__PURE__*/React__default.default.createElement(designSystem.Loader, null)) : /*#__PURE__*/React__default.default.createElement(React__default.default.Fragment, null, /*#__PURE__*/React__default.default.createElement(designSystem.Table, null, /*#__PURE__*/React__default.default.createElement(designSystem.TableHead, null, /*#__PURE__*/React__default.default.createElement(designSystem.TableRow, null, resource.listProperties.slice(0, 5).map(prop => /*#__PURE__*/React__default.default.createElement(designSystem.TableCell, {
      key: prop.name
    }, prop.label)), /*#__PURE__*/React__default.default.createElement(designSystem.TableCell, null, "Actions"))), /*#__PURE__*/React__default.default.createElement(designSystem.TableBody, null, data.map(record => /*#__PURE__*/React__default.default.createElement(designSystem.TableRow, {
      key: record.id
    }, resource.listProperties.slice(0, 5).map(prop => /*#__PURE__*/React__default.default.createElement(designSystem.TableCell, {
      key: prop.name
    }, record.params[prop.name]?.toString() || '-')), /*#__PURE__*/React__default.default.createElement(designSystem.TableCell, null, /*#__PURE__*/React__default.default.createElement(designSystem.Button, {
      size: "icon",
      variant: "text",
      onClick: () => window.location.href = `${window.location.origin}/admin/resources/${resource.id}/records/${record.id}/show`
    }, /*#__PURE__*/React__default.default.createElement(designSystem.Icon, {
      icon: "View"
    })), /*#__PURE__*/React__default.default.createElement(designSystem.Button, {
      size: "icon",
      variant: "text",
      onClick: () => window.location.href = `${window.location.origin}/admin/resources/${resource.id}/records/${record.id}/edit`
    }, /*#__PURE__*/React__default.default.createElement(designSystem.Icon, {
      icon: "Edit"
    }))))))), meta.total > meta.perPage && /*#__PURE__*/React__default.default.createElement(designSystem.Box, {
      flex: true,
      justifyContent: "center",
      marginTop: "xl"
    }, /*#__PURE__*/React__default.default.createElement(designSystem.Pagination, {
      total: meta.total,
      perPage: meta.perPage,
      page: page,
      onChange: onPageChange
    })))));
  };

  AdminJS.UserComponents = {};
  AdminJS.UserComponents.Dashboard = Overview;
  AdminJS.UserComponents.ResourceList = ResourceList;

})(React, AdminJS, AdminJSDesignSystem);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYnVuZGxlLmpzIiwic291cmNlcyI6WyIuLi9zcmMvYWRtaW4vY29tcG9uZW50cy9vdmVydmlldy5qc3giLCIuLi9zcmMvYWRtaW4vY29tcG9uZW50cy9yZXNvdXJjZS1oZWFkZXIuanN4IiwiLi4vc3JjL2FkbWluL2NvbXBvbmVudHMvcmVzb3VyY2UtbGlzdC5qc3giLCJlbnRyeS5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgUmVhY3QsIHsgdXNlU3RhdGUsIHVzZUVmZmVjdCB9IGZyb20gJ3JlYWN0JztcbmltcG9ydCB7IEFwaUNsaWVudCB9IGZyb20gJ2FkbWluanMnO1xuXG5jb25zdCBFcnJvckJhckNoYXJ0ID0gKHsgc3RhdHMgfSkgPT4ge1xuICBpZiAoIXN0YXRzIHx8IHN0YXRzLmxlbmd0aCA9PT0gMCkgcmV0dXJuIDxkaXY+Tm8gZXJyb3IgZGF0YSBhdmFpbGFibGU8L2Rpdj47XG4gIGNvbnN0IG1heENvdW50ID0gTWF0aC5tYXgoLi4uc3RhdHMubWFwKHMgPT4gcy5jb3VudCksIDUpO1xuICBcbiAgcmV0dXJuIChcbiAgICA8ZGl2IHN0eWxlPXt7IGZsZXg6IDIsIGJhY2tncm91bmQ6ICcjZmZmJywgcGFkZGluZzogJzI0cHgnLCBib3JkZXJSYWRpdXM6ICcxNnB4JywgYm94U2hhZG93OiAnMCA0cHggNnB4IC0xcHggcmdiYSgwLDAsMCwwLjA1KScsIGJvcmRlcjogJzFweCBzb2xpZCAjZjFmNWY5JyB9fT5cbiAgICAgIDxoMyBzdHlsZT17eyBtYXJnaW46ICcwIDAgMjBweCAwJywgY29sb3I6ICcjMWUyOTNiJywgZm9udFNpemU6ICcxNnB4JywgZm9udFdlaWdodDogJzcwMCcgfX0+RXJyb3IgRnJlcXVlbmN5ICg3IERheXMpPC9oMz5cbiAgICAgIDxkaXYgc3R5bGU9e3sgZGlzcGxheTogJ2ZsZXgnLCBhbGlnbkl0ZW1zOiAnZmxleC1lbmQnLCBqdXN0aWZ5Q29udGVudDogJ3NwYWNlLWJldHdlZW4nLCBoZWlnaHQ6ICcxODBweCcsIGdhcDogJzhweCcsIHBhZGRpbmdUb3A6ICcyMHB4JyB9fT5cbiAgICAgICAge3N0YXRzLm1hcCgocykgPT4ge1xuICAgICAgICAgIGNvbnN0IGhlaWdodCA9IChzLmNvdW50IC8gbWF4Q291bnQpICogMTAwO1xuICAgICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICA8ZGl2IGtleT17cy5kYXl9IHN0eWxlPXt7IGZsZXg6IDEsIGRpc3BsYXk6ICdmbGV4JywgZmxleERpcmVjdGlvbjogJ2NvbHVtbicsIGFsaWduSXRlbXM6ICdjZW50ZXInLCBoZWlnaHQ6ICcxMDAlJyB9fT5cbiAgICAgICAgICAgICAgPGRpdiBzdHlsZT17eyBmbGV4OiAxLCB3aWR0aDogJzEwMCUnLCBkaXNwbGF5OiAnZmxleCcsIGFsaWduSXRlbXM6ICdmbGV4LWVuZCcgfX0+XG4gICAgICAgICAgICAgICAgPGRpdiBcbiAgICAgICAgICAgICAgICAgIHN0eWxlPXt7IFxuICAgICAgICAgICAgICAgICAgICB3aWR0aDogJzEwMCUnLCBcbiAgICAgICAgICAgICAgICAgICAgaGVpZ2h0OiBgJHtNYXRoLm1heChoZWlnaHQsIDIpfSVgLCBcbiAgICAgICAgICAgICAgICAgICAgYmFja2dyb3VuZDogcy5jb3VudCA+IDAgPyAnbGluZWFyLWdyYWRpZW50KHRvIHRvcCwgIzYzNjZmMSwgI2E1YjRmYyknIDogJyNmMWY1ZjknLFxuICAgICAgICAgICAgICAgICAgICBib3JkZXJSYWRpdXM6ICc2cHggNnB4IDJweCAycHgnLFxuICAgICAgICAgICAgICAgICAgICB0cmFuc2l0aW9uOiAnYWxsIDAuNXMgY3ViaWMtYmV6aWVyKDAuNCwgMCwgMC4yLCAxKScsXG4gICAgICAgICAgICAgICAgICAgIHBvc2l0aW9uOiAncmVsYXRpdmUnXG4gICAgICAgICAgICAgICAgICB9fVxuICAgICAgICAgICAgICAgID5cbiAgICAgICAgICAgICAgICAgIHtzLmNvdW50ID4gMCAmJiA8c3BhbiBzdHlsZT17eyBwb3NpdGlvbjogJ2Fic29sdXRlJywgdG9wOiAnLTI1cHgnLCBsZWZ0OiAnNTAlJywgdHJhbnNmb3JtOiAndHJhbnNsYXRlWCgtNTAlKScsIGZvbnRTaXplOiAnMTFweCcsIGZvbnRXZWlnaHQ6ICc3MDAnLCBjb2xvcjogJyM2MzY2ZjEnIH19PntzLmNvdW50fTwvc3Bhbj59XG4gICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICA8ZGl2IHN0eWxlPXt7IGZvbnRTaXplOiAnMTBweCcsIGNvbG9yOiAnIzk0YTNiOCcsIG1hcmdpblRvcDogJzEycHgnLCBmb250V2VpZ2h0OiAnNTAwJyB9fT57cy5kYXkuc3BsaXQoJy0nKS5zbGljZSgyKX08L2Rpdj5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICk7XG4gICAgICAgIH0pfVxuICAgICAgPC9kaXY+XG4gICAgPC9kaXY+XG4gICk7XG59O1xuXG5jb25zdCBGbG93RG9udXRDaGFydCA9ICh7IHN0YXRzIH0pID0+IHtcbiAgaWYgKCFzdGF0cyB8fCBzdGF0cy5sZW5ndGggPT09IDApIHJldHVybiBudWxsO1xuICBjb25zdCB0b3RhbCA9IHN0YXRzLnJlZHVjZSgoYWNjLCBjdXJyKSA9PiBhY2MgKyBjdXJyLmNvdW50LCAwKTtcbiAgbGV0IGN1bXVsYXRpdmUgPSAwO1xuICBcbiAgY29uc3QgY29sb3JzID0gWycjNjM2NmYxJywgJyMxMGI5ODEnLCAnI2Y1OWUwYicsICcjZWY0NDQ0JywgJyM4YjVjZjYnXTtcbiAgY29uc3QgZ3JhZGllbnRQYXJ0cyA9IHN0YXRzLm1hcCgocywgaSkgPT4ge1xuICAgIGNvbnN0IHN0YXJ0ID0gKGN1bXVsYXRpdmUgLyB0b3RhbCkgKiAxMDA7XG4gICAgY29uc3QgZW5kID0gKChjdW11bGF0aXZlICsgcy5jb3VudCkgLyB0b3RhbCkgKiAxMDA7XG4gICAgY3VtdWxhdGl2ZSArPSBzLmNvdW50O1xuICAgIHJldHVybiBgJHtjb2xvcnNbaSAlIGNvbG9ycy5sZW5ndGhdfSAke3N0YXJ0fSUgJHtlbmR9JWA7XG4gIH0pO1xuXG4gIHJldHVybiAoXG4gICAgPGRpdiBzdHlsZT17eyBmbGV4OiAxLCBiYWNrZ3JvdW5kOiAnI2ZmZicsIHBhZGRpbmc6ICcyNHB4JywgYm9yZGVyUmFkaXVzOiAnMTZweCcsIGJveFNoYWRvdzogJzAgNHB4IDZweCAtMXB4IHJnYmEoMCwwLDAsMC4wNSknLCBib3JkZXI6ICcxcHggc29saWQgI2YxZjVmOScgfX0+XG4gICAgICA8aDMgc3R5bGU9e3sgbWFyZ2luOiAnMCAwIDIwcHggMCcsIGNvbG9yOiAnIzFlMjkzYicsIGZvbnRTaXplOiAnMTZweCcsIGZvbnRXZWlnaHQ6ICc3MDAnIH19PkVycm9ycyBieSBGbG93PC9oMz5cbiAgICAgIDxkaXYgc3R5bGU9e3sgZGlzcGxheTogJ2ZsZXgnLCBmbGV4RGlyZWN0aW9uOiAnY29sdW1uJywgYWxpZ25JdGVtczogJ2NlbnRlcicgfX0+XG4gICAgICAgIDxkaXYgc3R5bGU9e3sgXG4gICAgICAgICAgd2lkdGg6ICcxNDBweCcsIFxuICAgICAgICAgIGhlaWdodDogJzE0MHB4JywgXG4gICAgICAgICAgYm9yZGVyUmFkaXVzOiAnNTAlJywgXG4gICAgICAgICAgYmFja2dyb3VuZDogYGNvbmljLWdyYWRpZW50KCR7Z3JhZGllbnRQYXJ0cy5qb2luKCcsICcpfSlgLFxuICAgICAgICAgIGRpc3BsYXk6ICdmbGV4JyxcbiAgICAgICAgICBhbGlnbkl0ZW1zOiAnY2VudGVyJyxcbiAgICAgICAgICBqdXN0aWZ5Q29udGVudDogJ2NlbnRlcicsXG4gICAgICAgICAgcG9zaXRpb246ICdyZWxhdGl2ZScsXG4gICAgICAgICAgbWFyZ2luQm90dG9tOiAnMjBweCdcbiAgICAgICAgfX0+XG4gICAgICAgICAgPGRpdiBzdHlsZT17eyB3aWR0aDogJzEwMHB4JywgaGVpZ2h0OiAnMTAwcHgnLCBiYWNrZ3JvdW5kOiAnI2ZmZicsIGJvcmRlclJhZGl1czogJzUwJScsIGRpc3BsYXk6ICdmbGV4JywgYWxpZ25JdGVtczogJ2NlbnRlcicsIGZsZXhEaXJlY3Rpb246ICdjb2x1bW4nLCBqdXN0aWZ5Q29udGVudDogJ2NlbnRlcicgfX0+XG4gICAgICAgICAgICA8c3BhbiBzdHlsZT17eyBmb250U2l6ZTogJzI0cHgnLCBmb250V2VpZ2h0OiAnODAwJywgY29sb3I6ICcjMWUyOTNiJyB9fT57dG90YWx9PC9zcGFuPlxuICAgICAgICAgICAgPHNwYW4gc3R5bGU9e3sgZm9udFNpemU6ICcxMHB4JywgY29sb3I6ICcjNjQ3NDhiJywgdGV4dFRyYW5zZm9ybTogJ3VwcGVyY2FzZScgfX0+VG90YWw8L3NwYW4+XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgIDwvZGl2PlxuICAgICAgICA8ZGl2IHN0eWxlPXt7IHdpZHRoOiAnMTAwJScgfX0+XG4gICAgICAgICAge3N0YXRzLm1hcCgocywgaSkgPT4gKFxuICAgICAgICAgICAgPGRpdiBrZXk9e3MubmFtZX0gc3R5bGU9e3sgZGlzcGxheTogJ2ZsZXgnLCBhbGlnbkl0ZW1zOiAnY2VudGVyJywganVzdGlmeUNvbnRlbnQ6ICdzcGFjZS1iZXR3ZWVuJywgbWFyZ2luQm90dG9tOiAnOHB4JyB9fT5cbiAgICAgICAgICAgICAgPGRpdiBzdHlsZT17eyBkaXNwbGF5OiAnZmxleCcsIGFsaWduSXRlbXM6ICdjZW50ZXInLCBnYXA6ICc4cHgnIH19PlxuICAgICAgICAgICAgICAgIDxkaXYgc3R5bGU9e3sgd2lkdGg6ICc4cHgnLCBoZWlnaHQ6ICc4cHgnLCBib3JkZXJSYWRpdXM6ICc1MCUnLCBiYWNrZ3JvdW5kOiBjb2xvcnNbaSAlIGNvbG9ycy5sZW5ndGhdIH19PjwvZGl2PlxuICAgICAgICAgICAgICAgIDxzcGFuIHN0eWxlPXt7IGZvbnRTaXplOiAnMTJweCcsIGNvbG9yOiAnIzQ3NTU2OScsIG1heFdpZHRoOiAnMTAwcHgnLCBvdmVyZmxvdzogJ2hpZGRlbicsIHRleHRPdmVyZmxvdzogJ2VsbGlwc2lzJywgd2hpdGVTcGFjZTogJ25vd3JhcCcgfX0+e3MubmFtZX08L3NwYW4+XG4gICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICA8c3BhbiBzdHlsZT17eyBmb250U2l6ZTogJzEycHgnLCBmb250V2VpZ2h0OiAnNzAwJywgY29sb3I6ICcjMWUyOTNiJyB9fT57TWF0aC5yb3VuZCgocy5jb3VudC90b3RhbCkqMTAwKX0lPC9zcGFuPlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgKSl9XG4gICAgICAgIDwvZGl2PlxuICAgICAgPC9kaXY+XG4gICAgPC9kaXY+XG4gICk7XG59O1xuXG5jb25zdCBFbmRwb2ludFJhbmtpbmcgPSAoeyBzdGF0cyB9KSA9PiB7XG4gIGlmICghc3RhdHMgfHwgc3RhdHMubGVuZ3RoID09PSAwKSByZXR1cm4gbnVsbDtcbiAgY29uc3QgbWF4ID0gc3RhdHNbMF0uY291bnQ7XG5cbiAgcmV0dXJuIChcbiAgICA8ZGl2IHN0eWxlPXt7IGJhY2tncm91bmQ6ICcjZmZmJywgcGFkZGluZzogJzI0cHgnLCBib3JkZXJSYWRpdXM6ICcxNnB4JywgYm94U2hhZG93OiAnMCA0cHggNnB4IC0xcHggcmdiYSgwLDAsMCwwLjA1KScsIGJvcmRlcjogJzFweCBzb2xpZCAjZjFmNWY5JywgbWFyZ2luVG9wOiAnMjBweCcgfX0+XG4gICAgICA8aDMgc3R5bGU9e3sgbWFyZ2luOiAnMCAwIDIwcHggMCcsIGNvbG9yOiAnIzFlMjkzYicsIGZvbnRTaXplOiAnMTZweCcsIGZvbnRXZWlnaHQ6ICc3MDAnIH19PlRvcCBQcm9ibGVtYXRpYyBFbmRwb2ludHM8L2gzPlxuICAgICAge3N0YXRzLm1hcCgocywgaSkgPT4gKFxuICAgICAgICA8ZGl2IGtleT17cy5uYW1lfSBzdHlsZT17eyBtYXJnaW5Cb3R0b206ICcxNnB4JyB9fT5cbiAgICAgICAgICA8ZGl2IHN0eWxlPXt7IGRpc3BsYXk6ICdmbGV4JywganVzdGlmeUNvbnRlbnQ6ICdzcGFjZS1iZXR3ZWVuJywgbWFyZ2luQm90dG9tOiAnNnB4JyB9fT5cbiAgICAgICAgICAgIDxzcGFuIHN0eWxlPXt7IGZvbnRTaXplOiAnMTNweCcsIGZvbnRXZWlnaHQ6ICc2MDAnLCBjb2xvcjogJyM0NzU1NjknIH19PntzLm5hbWV9PC9zcGFuPlxuICAgICAgICAgICAgPHNwYW4gc3R5bGU9e3sgZm9udFNpemU6ICcxM3B4JywgZm9udFdlaWdodDogJzcwMCcsIGNvbG9yOiAnIzFlMjkzYicgfX0+e3MuY291bnR9IGVycm9yczwvc3Bhbj5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICA8ZGl2IHN0eWxlPXt7IHdpZHRoOiAnMTAwJScsIGhlaWdodDogJzhweCcsIGJhY2tncm91bmQ6ICcjZjFmNWY5JywgYm9yZGVyUmFkaXVzOiAnNHB4Jywgb3ZlcmZsb3c6ICdoaWRkZW4nIH19PlxuICAgICAgICAgICAgPGRpdiBzdHlsZT17eyB3aWR0aDogYCR7KHMuY291bnQvbWF4KSoxMDB9JWAsIGhlaWdodDogJzEwMCUnLCBiYWNrZ3JvdW5kOiAnbGluZWFyLWdyYWRpZW50KDkwZGVnLCAjZWY0NDQ0LCAjZjg3MTcxKScsIGJvcmRlclJhZGl1czogJzRweCcsIHRyYW5zaXRpb246ICd3aWR0aCAxcyBlYXNlLW91dCcgfX0+PC9kaXY+XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgIDwvZGl2PlxuICAgICAgKSl9XG4gICAgPC9kaXY+XG4gICk7XG59O1xuXG5jb25zdCBPdmVydmlldyA9IChwcm9wcykgPT4ge1xuICBjb25zdCBbZGF0YSwgc2V0RGF0YV0gPSB1c2VTdGF0ZShwcm9wcy5kYXRhIHx8IHt9KTtcbiAgY29uc3QgW2xvYWRpbmcsIHNldExvYWRpbmddID0gdXNlU3RhdGUoIXByb3BzLmRhdGEgfHwgIXByb3BzLmRhdGEuZmxvd1N0YXRzKTtcbiAgY29uc3QgYXBpID0gbmV3IEFwaUNsaWVudCgpO1xuXG4gIHVzZUVmZmVjdCgoKSA9PiB7XG4gICAgaWYgKCFwcm9wcy5kYXRhIHx8ICFwcm9wcy5kYXRhLmZsb3dTdGF0cykge1xuICAgICAgc2V0TG9hZGluZyh0cnVlKTtcbiAgICAgIGFwaS5nZXREYXNoYm9hcmQoKVxuICAgICAgICAudGhlbihyZXNwb25zZSA9PiB7XG4gICAgICAgICAgc2V0RGF0YShyZXNwb25zZS5kYXRhKTtcbiAgICAgICAgICBzZXRMb2FkaW5nKGZhbHNlKTtcbiAgICAgICAgfSlcbiAgICAgICAgLmNhdGNoKGVyciA9PiB7XG4gICAgICAgICAgY29uc29sZS5lcnJvcignRXJyb3IgZmV0Y2hpbmcgZGFzaGJvYXJkIGRhdGE6JywgZXJyKTtcbiAgICAgICAgICBzZXRMb2FkaW5nKGZhbHNlKTtcbiAgICAgICAgfSk7XG4gICAgfVxuICB9LCBbcHJvcHMuZGF0YV0pO1xuXG4gIGlmIChsb2FkaW5nKSB7XG4gICAgcmV0dXJuIChcbiAgICAgIDxkaXYgc3R5bGU9e3sgcGFkZGluZzogJzYwcHgnLCB0ZXh0QWxpZ246ICdjZW50ZXInLCBiYWNrZ3JvdW5kOiAnI2Y4ZmFmYycsIG1pbkhlaWdodDogJzEwMHZoJyB9fT5cbiAgICAgICAgPGRpdiBzdHlsZT17eyBkaXNwbGF5OiAnaW5saW5lLWJsb2NrJywgd2lkdGg6ICc0MHB4JywgaGVpZ2h0OiAnNDBweCcsIGJvcmRlcjogJzNweCBzb2xpZCAjZTJlOGYwJywgYm9yZGVyVG9wQ29sb3I6ICcjNjM2NmYxJywgYm9yZGVyUmFkaXVzOiAnNTAlJywgYW5pbWF0aW9uOiAnc3BpbiAxcyBsaW5lYXIgaW5maW5pdGUnIH19PjwvZGl2PlxuICAgICAgICA8c3R5bGU+e2BAa2V5ZnJhbWVzIHNwaW4geyB0byB7IHRyYW5zZm9ybTogcm90YXRlKDM2MGRlZyk7IH0gfWB9PC9zdHlsZT5cbiAgICAgICAgPGgyIHN0eWxlPXt7IGNvbG9yOiAnIzFlMjkzYicsIG1hcmdpblRvcDogJzIwcHgnIH19PkxvYWRpbmcgSW50ZWxsaWdlbmNlLi4uPC9oMj5cbiAgICAgIDwvZGl2PlxuICAgICk7XG4gIH1cblxuICByZXR1cm4gKFxuICAgIDxkaXYgc3R5bGU9e3sgcGFkZGluZzogJzQwcHgnLCBiYWNrZ3JvdW5kOiAnI2Y4ZmFmYycsIG1pbkhlaWdodDogJzEwMHZoJywgZm9udEZhbWlseTogXCInSW50ZXInLCBzYW5zLXNlcmlmXCIgfX0+XG4gICAgICA8ZGl2IHN0eWxlPXt7IG1heFdpZHRoOiAnMTIwMHB4JywgbWFyZ2luOiAnMCBhdXRvJyB9fT5cbiAgICAgICAgPGRpdiBzdHlsZT17eyBkaXNwbGF5OiAnZmxleCcsIGp1c3RpZnlDb250ZW50OiAnc3BhY2UtYmV0d2VlbicsIGFsaWduSXRlbXM6ICdmbGV4LXN0YXJ0JywgbWFyZ2luQm90dG9tOiAnNDBweCcgfX0+XG4gICAgICAgICAgPGRpdj5cbiAgICAgICAgICAgIDxoMSBzdHlsZT17eyBjb2xvcjogJyMxZTI5M2InLCBmb250U2l6ZTogJzI4cHgnLCBmb250V2VpZ2h0OiAnODAwJywgbWFyZ2luOiAnMCAwIDhweCAwJyB9fT5TeXN0ZW0gSGVhbHRoIERhc2hib2FyZDwvaDE+XG4gICAgICAgICAgICA8cCBzdHlsZT17eyBjb2xvcjogJyM2NDc0OGInLCBmb250U2l6ZTogJzE2cHgnIH19PlJlYWwtdGltZSBlcnJvciBhbmFseXNpcyBhbmQgdHJhZmZpYyBkaXN0cmlidXRpb24uPC9wPlxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgIDxkaXYgc3R5bGU9e3sgYmFja2dyb3VuZDogJyNmZmYnLCBwYWRkaW5nOiAnOHB4IDE2cHgnLCBib3JkZXJSYWRpdXM6ICcxMHB4JywgYm94U2hhZG93OiAnMCAxcHggMnB4IHJnYmEoMCwwLDAsMC4wNSknLCBkaXNwbGF5OiAnZmxleCcsIGFsaWduSXRlbXM6ICdjZW50ZXInLCBnYXA6ICc4cHgnIH19PlxuICAgICAgICAgICAgPGRpdiBzdHlsZT17eyB3aWR0aDogJzhweCcsIGhlaWdodDogJzhweCcsIGJhY2tncm91bmQ6ICcjMjJjNTVlJywgYm9yZGVyUmFkaXVzOiAnNTAlJywgYm94U2hhZG93OiAnMCAwIDZweCAjMjJjNTVlJyB9fT48L2Rpdj5cbiAgICAgICAgICAgIDxzcGFuIHN0eWxlPXt7IGZvbnRTaXplOiAnMTNweCcsIGZvbnRXZWlnaHQ6ICc2MDAnLCBjb2xvcjogJyMxZTI5M2InIH19PkxpdmUgTW9kZTwvc3Bhbj5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgPC9kaXY+XG4gICAgICAgIFxuICAgICAgICB7LyogVG9wIENhcmRzICovfVxuICAgICAgICA8ZGl2IHN0eWxlPXt7IGRpc3BsYXk6ICdncmlkJywgZ3JpZFRlbXBsYXRlQ29sdW1uczogJ3JlcGVhdChhdXRvLWZpdCwgbWlubWF4KDIyMHB4LCAxZnIpKScsIGdhcDogJzI0cHgnLCBtYXJnaW5Cb3R0b206ICczMnB4JyB9fT5cbiAgICAgICAgICB7W1xuICAgICAgICAgICAgeyBsYWJlbDogJ0FjdGl2ZSBVc2VycycsIHZhbHVlOiBkYXRhLnVzZXJDb3VudCwgY29sb3I6ICcjNjM2NmYxJyB9LFxuICAgICAgICAgICAgeyBsYWJlbDogJ01lc3NhZ2VzIFByb2Nlc3NlZCcsIHZhbHVlOiBkYXRhLm1lc3NhZ2VDb3VudCwgY29sb3I6ICcjMTBiOTgxJyB9LFxuICAgICAgICAgICAgeyBsYWJlbDogJ0luY2lkZW50cyBsb2dnZWQnLCB2YWx1ZTogZGF0YS5lcnJvckNvdW50LCBjb2xvcjogJyNlZjQ0NDQnLCBpc0RhbmdlcjogdHJ1ZSB9XG4gICAgICAgICAgXS5tYXAoY2FyZCA9PiAoXG4gICAgICAgICAgICA8ZGl2IGtleT17Y2FyZC5sYWJlbH0gc3R5bGU9e3sgYmFja2dyb3VuZDogJyNmZmYnLCBwYWRkaW5nOiAnMjRweCcsIGJvcmRlclJhZGl1czogJzE2cHgnLCBib3hTaGFkb3c6ICcwIDRweCA2cHggLTFweCByZ2JhKDAsMCwwLDAuMDUpJywgcG9zaXRpb246ICdyZWxhdGl2ZScsIG92ZXJmbG93OiAnaGlkZGVuJyB9fT5cbiAgICAgICAgICAgICAgPGRpdiBzdHlsZT17eyBwb3NpdGlvbjogJ2Fic29sdXRlJywgdG9wOiAwLCBsZWZ0OiAwLCB3aWR0aDogJzRweCcsIGhlaWdodDogJzEwMCUnLCBiYWNrZ3JvdW5kOiBjYXJkLmNvbG9yIH19PjwvZGl2PlxuICAgICAgICAgICAgICA8ZGl2IHN0eWxlPXt7IGNvbG9yOiAnIzY0NzQ4YicsIGZvbnRTaXplOiAnMTJweCcsIGZvbnRXZWlnaHQ6ICc3MDAnLCB0ZXh0VHJhbnNmb3JtOiAndXBwZXJjYXNlJywgbGV0dGVyU3BhY2luZzogJzAuNXB4JyB9fT57Y2FyZC5sYWJlbH08L2Rpdj5cbiAgICAgICAgICAgICAgPGRpdiBzdHlsZT17eyBmb250U2l6ZTogJzMycHgnLCBmb250V2VpZ2h0OiAnODAwJywgY29sb3I6ICcjMWUyOTNiJywgbWFyZ2luVG9wOiAnOHB4JyB9fT57Y2FyZC52YWx1ZSA/PyAwfTwvZGl2PlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgKSl9XG4gICAgICAgIDwvZGl2PlxuXG4gICAgICAgIHsvKiBNaWRkbGUgQ2hhcnRzICovfVxuICAgICAgICA8ZGl2IHN0eWxlPXt7IGRpc3BsYXk6ICdmbGV4JywgZ2FwOiAnMjRweCcsIGZsZXhXcmFwOiAnd3JhcCcgfX0+XG4gICAgICAgICAgPEVycm9yQmFyQ2hhcnQgc3RhdHM9e2RhdGEuZXJyb3JTdGF0c30gLz5cbiAgICAgICAgICA8Rmxvd0RvbnV0Q2hhcnQgc3RhdHM9e2RhdGEuZmxvd1N0YXRzfSAvPlxuICAgICAgICA8L2Rpdj5cblxuICAgICAgICB7LyogQm90dG9tIFJhbmtpbmcgKi99XG4gICAgICAgIDxFbmRwb2ludFJhbmtpbmcgc3RhdHM9e2RhdGEuZW5kcG9pbnRTdGF0c30gLz5cblxuICAgICAgICA8ZGl2IHN0eWxlPXt7IG1hcmdpblRvcDogJzQwcHgnLCB0ZXh0QWxpZ246ICdjZW50ZXInLCBjb2xvcjogJyM5NGEzYjgnLCBmb250U2l6ZTogJzEzcHgnIH19PlxuICAgICAgICAgIExhbnRhbmEgTW9uaXRvcmluZyBFbmdpbmUgdjIuMCDigKIgTGFzdCBTeW5jOiB7bmV3IERhdGUoKS50b0xvY2FsZVRpbWVTdHJpbmcoKX1cbiAgICAgICAgPC9kaXY+XG4gICAgICA8L2Rpdj5cbiAgICA8L2Rpdj5cbiAgKTtcbn07XG5cbmV4cG9ydCBkZWZhdWx0IE92ZXJ2aWV3O1xuIiwiaW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0JztcbmltcG9ydCB7IEJveCwgSDMsIFRleHQsIElsbHVzdHJhdGlvbiwgVmFsdWVHcm91cCwgQnV0dG9uIH0gZnJvbSAnQGFkbWluanMvZGVzaWduLXN5c3RlbSc7XG5cbmNvbnN0IFJlc291cmNlSGVhZGVyID0gKHByb3BzKSA9PiB7XG4gIGNvbnN0IHsgcmVzb3VyY2UsIGFjdGlvbiB9ID0gcHJvcHM7XG4gIGNvbnN0IHN0YXRzID0gYWN0aW9uLm1ldGE/LnN0YXRzIHx8IHt9O1xuICBjb25zdCByZXNvdXJjZU5hbWUgPSByZXNvdXJjZS5uYW1lO1xuXG4gIC8vIFJlbmRlciBkaWZmZXJlbnQgaWNvbnMvY29sb3JzIGJhc2VkIG9uIHJlc291cmNlXG4gIGNvbnN0IGdldFJlc291cmNlQ29uZmlnID0gKCkgPT4ge1xuICAgIHN3aXRjaChyZXNvdXJjZU5hbWUpIHtcbiAgICAgIGNhc2UgJ1VzZXInOiByZXR1cm4geyBjb2xvcjogJyM2MzY2ZjEnLCBpY29uOiAnVXNlcicsIGxhYmVsOiAnVXNlciBBbmFseXRpY3MnIH07XG4gICAgICBjYXNlICdFcnJvcnMnOiByZXR1cm4geyBjb2xvcjogJyNlZjQ0NDQnLCBpY29uOiAnV2FybmluZycsIGxhYmVsOiAnRXJyb3IgSW50ZWxsaWdlbmNlJyB9O1xuICAgICAgY2FzZSAnTWVzc2FnZSc6IHJldHVybiB7IGNvbG9yOiAnIzEwYjk4MScsIGljb246ICdFbWFpbCcsIGxhYmVsOiAnQ29tbXVuaWNhdGlvbiBTdGF0cycgfTtcbiAgICAgIGNhc2UgJ1Jvb20nOiByZXR1cm4geyBjb2xvcjogJyNmNTllMGInLCBpY29uOiAnQ2hhdCcsIGxhYmVsOiAnUm9vbSBBY3Rpdml0eScgfTtcbiAgICAgIGRlZmF1bHQ6IHJldHVybiB7IGNvbG9yOiAnIzYzNjZmMScsIGljb246ICdBY3Rpdml0eScsIGxhYmVsOiAnT3ZlcnZpZXcnIH07XG4gICAgfVxuICB9O1xuXG4gIGNvbnN0IGNvbmZpZyA9IGdldFJlc291cmNlQ29uZmlnKCk7XG5cbiAgcmV0dXJuIChcbiAgICA8Qm94IHZhcmlhbnQ9XCJ3aGl0ZVwiIHBhZGRpbmc9XCJ4bFwiIG1hcmdpbkJvdHRvbT1cInhsXCIgYm9yZGVyUmFkaXVzPVwibGdcIiBib3hTaGFkb3c9XCJjYXJkXCI+XG4gICAgICA8Qm94IGZsZXggZmxleERpcmVjdGlvbj1cInJvd1wiIGFsaWduSXRlbXM9XCJjZW50ZXJcIiBqdXN0aWZ5Q29udGVudD1cInNwYWNlLWJldHdlZW5cIiBtYXJnaW5Cb3R0b209XCJ4bFwiPlxuICAgICAgICA8Qm94IGZsZXggZmxleERpcmVjdGlvbj1cInJvd1wiIGFsaWduSXRlbXM9XCJjZW50ZXJcIiBnYXA9XCJsZ1wiPlxuICAgICAgICAgICA8Qm94IFxuICAgICAgICAgICAgIGJhY2tncm91bmRDb2xvcj17Y29uZmlnLmNvbG9yfSBcbiAgICAgICAgICAgICBwYWRkaW5nPVwibWRcIiBcbiAgICAgICAgICAgICBib3JkZXJSYWRpdXM9XCJtZFwiIFxuICAgICAgICAgICAgIGNvbG9yPVwid2hpdGVcIlxuICAgICAgICAgICAgIGRpc3BsYXk9XCJmbGV4XCJcbiAgICAgICAgICAgICBhbGlnbkl0ZW1zPVwiY2VudGVyXCJcbiAgICAgICAgICAgICBqdXN0aWZ5Q29udGVudD1cImNlbnRlclwiXG4gICAgICAgICAgID5cbiAgICAgICAgICAgICB7LyogU2ltcGxlIFNWRyBpY29uIG1hcHBpbmcgKi99XG4gICAgICAgICAgICAgPHN2ZyB3aWR0aD1cIjI0XCIgaGVpZ2h0PVwiMjRcIiB2aWV3Qm94PVwiMCAwIDI0IDI0XCIgZmlsbD1cIm5vbmVcIiBzdHJva2U9XCJjdXJyZW50Q29sb3JcIiBzdHJva2VXaWR0aD1cIjJcIiBzdHJva2VMaW5lY2FwPVwicm91bmRcIiBzdHJva2VMaW5lam9pbj1cInJvdW5kXCI+XG4gICAgICAgICAgICAgICB7cmVzb3VyY2VOYW1lID09PSAnVXNlcicgJiYgPD48cGF0aCBkPVwiTTIwIDIxdi0yYTQgNCAwIDAgMC00LTRIOGE0IDQgMCAwIDAtNCA0djJcIi8+PGNpcmNsZSBjeD1cIjEyXCIgY3k9XCI3XCIgcj1cIjRcIi8+PC8+fVxuICAgICAgICAgICAgICAge3Jlc291cmNlTmFtZSA9PT0gJ0Vycm9ycycgJiYgPD48cGF0aCBkPVwibTIxLjczIDE4LTgtMTRhMiAyIDAgMCAwLTMuNDggMGwtOCAxNEEyIDIgMCAwIDAgNCAyMWgxNmEyIDIgMCAwIDAgMS43My0zWlwiLz48cGF0aCBkPVwiTTEyIDl2NFwiLz48cGF0aCBkPVwiTTEyIDE3aC4wMVwiLz48Lz59XG4gICAgICAgICAgICAgICB7cmVzb3VyY2VOYW1lID09PSAnTWVzc2FnZScgJiYgPD48cGF0aCBkPVwiTTQgNGgxNmMxLjEgMCAyIC45IDIgMnYxMmMwIDEuMS0uOSAyLTIgMkg0Yy0xLjEgMC0yLS45LTItMlY2YzAtMS4xLjktMiAyLTJ6XCIvPjxwb2x5bGluZSBwb2ludHM9XCIyMiw2IDEyLDEzIDIsNlwiLz48Lz59XG4gICAgICAgICAgICAgICB7cmVzb3VyY2VOYW1lID09PSAnUm9vbScgJiYgPHBhdGggZD1cIk0yMSAxNWEyIDIgMCAwIDEtMiAySDdsLTQgNFY1YTIgMiAwIDAgMSAyLTJoMTRhMiAyIDAgMCAxIDIgMnpcIi8+fVxuICAgICAgICAgICAgIDwvc3ZnPlxuICAgICAgICAgICA8L0JveD5cbiAgICAgICAgICAgPEJveD5cbiAgICAgICAgICAgICA8SDMgbWFyZ2luQm90dG9tPVwiMFwiIGNvbG9yPVwiZ3JleTEwMFwiPntjb25maWcubGFiZWx9PC9IMz5cbiAgICAgICAgICAgICA8VGV4dCBzaXplPVwic21cIiBjb2xvcj1cImdyZXk2MFwiPntyZXNvdXJjZU5hbWV9IG1hbmFnZW1lbnQgYW5kIHJlYWwtdGltZSBtb25pdG9yaW5nPC9UZXh0PlxuICAgICAgICAgICA8L0JveD5cbiAgICAgICAgPC9Cb3g+XG4gICAgICA8L0JveD5cblxuICAgICAgPEJveCBkaXNwbGF5PVwiZ3JpZFwiIGdyaWRUZW1wbGF0ZUNvbHVtbnM9XCJyZXBlYXQoYXV0by1maXQsIG1pbm1heCgxODBweCwgMWZyKSlcIiBnYXA9XCJsZ1wiPlxuICAgICAgICB7T2JqZWN0LmVudHJpZXMoc3RhdHMpLm1hcCgoW2xhYmVsLCB2YWx1ZV0pID0+IChcbiAgICAgICAgICA8Qm94IGtleT17bGFiZWx9IHBhZGRpbmc9XCJsZ1wiIGJhY2tncm91bmRDb2xvcj1cImdyZXkyMFwiIGJvcmRlclJhZGl1cz1cIm1kXCIgYm9yZGVyPXtgMXB4IHNvbGlkICNlMmU4ZjBgfT5cbiAgICAgICAgICAgIDxUZXh0IGNvbG9yPVwiZ3JleTYwXCIgc2l6ZT1cInhzXCIgZm9udFdlaWdodD1cImJvbGRcIiB0ZXh0VHJhbnNmb3JtPVwidXBwZXJjYXNlXCIgbGV0dGVyU3BhY2luZz1cIndpZGVyXCI+e2xhYmVsLnJlcGxhY2UoLyhbQS1aXSkvZywgJyAkMScpfTwvVGV4dD5cbiAgICAgICAgICAgIDxUZXh0IGNvbG9yPVwiZ3JleTEwMFwiIHNpemU9XCJ4bFwiIGZvbnRXZWlnaHQ9XCI4MDBcIiBtYXJnaW5Ub3A9XCJzbVwiPnt2YWx1ZX08L1RleHQ+XG4gICAgICAgICAgPC9Cb3g+XG4gICAgICAgICkpfVxuICAgICAgPC9Cb3g+XG4gICAgPC9Cb3g+XG4gICk7XG59O1xuXG5leHBvcnQgZGVmYXVsdCBSZXNvdXJjZUhlYWRlcjtcbiIsImltcG9ydCBSZWFjdCwgeyB1c2VTdGF0ZSwgdXNlRWZmZWN0IH0gZnJvbSAncmVhY3QnO1xuaW1wb3J0IHsgQXBpQ2xpZW50LCB1c2VOb3RpY2UgfSBmcm9tICdhZG1pbmpzJztcbmltcG9ydCB7IEJveCwgVGFibGUsIFRhYmxlSGVhZCwgVGFibGVCb2R5LCBUYWJsZVJvdywgVGFibGVDZWxsLCBIMywgVGV4dCwgQnV0dG9uLCBJY29uLCBQYWdpbmF0aW9uLCBMb2FkZXIgfSBmcm9tICdAYWRtaW5qcy9kZXNpZ24tc3lzdGVtJztcbmltcG9ydCBSZXNvdXJjZUhlYWRlciBmcm9tICcuL3Jlc291cmNlLWhlYWRlci5qc3gnO1xuXG5jb25zdCBSZXNvdXJjZUxpc3QgPSAocHJvcHMpID0+IHtcbiAgY29uc3QgeyByZXNvdXJjZSwgYWN0aW9uIH0gPSBwcm9wcztcbiAgY29uc3QgW2RhdGEsIHNldERhdGFdID0gdXNlU3RhdGUoW10pO1xuICBjb25zdCBbbG9hZGluZywgc2V0TG9hZGluZ10gPSB1c2VTdGF0ZSh0cnVlKTtcbiAgY29uc3QgW21ldGEsIHNldE1ldGFdID0gdXNlU3RhdGUoe30pO1xuICBjb25zdCBbcGFnZSwgc2V0UGFnZV0gPSB1c2VTdGF0ZSgxKTtcbiAgY29uc3QgYXBpID0gbmV3IEFwaUNsaWVudCgpO1xuICBjb25zdCBzZW5kTm90aWNlID0gdXNlTm90aWNlKCk7XG5cbiAgY29uc3QgZmV0Y2hEYXRhID0gYXN5bmMgKHBhZ2VOdW0gPSAxKSA9PiB7XG4gICAgc2V0TG9hZGluZyh0cnVlKTtcbiAgICB0cnkge1xuICAgICAgY29uc3QgcmVzcG9uc2UgPSBhd2FpdCBhcGkucmVzb3VyY2VBY3Rpb24oe1xuICAgICAgICByZXNvdXJjZUlkOiByZXNvdXJjZS5pZCxcbiAgICAgICAgYWN0aW9uTmFtZTogJ2xpc3QnLFxuICAgICAgICBwYXJhbXM6IHsgcGFnZTogcGFnZU51bSB9XG4gICAgICB9KTtcbiAgICAgIHNldERhdGEocmVzcG9uc2UuZGF0YS5yZWNvcmRzKTtcbiAgICAgIHNldE1ldGEocmVzcG9uc2UuZGF0YS5tZXRhKTtcbiAgICAgIHNldFBhZ2UocGFnZU51bSk7XG4gICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICBzZW5kTm90aWNlKHsgbWVzc2FnZTogJ0Vycm9yIGZldGNoaW5nIGRhdGEnLCB0eXBlOiAnZXJyb3InIH0pO1xuICAgIH0gZmluYWxseSB7XG4gICAgICBzZXRMb2FkaW5nKGZhbHNlKTtcbiAgICB9XG4gIH07XG5cbiAgdXNlRWZmZWN0KCgpID0+IHtcbiAgICBmZXRjaERhdGEoKTtcbiAgfSwgW3Jlc291cmNlLmlkXSk7XG5cbiAgY29uc3Qgb25QYWdlQ2hhbmdlID0gKG5ld1BhZ2UpID0+IHtcbiAgICBmZXRjaERhdGEobmV3UGFnZSk7XG4gIH07XG5cbiAgcmV0dXJuIChcbiAgICA8Qm94IHBhZGRpbmc9XCJ4bFwiPlxuICAgICAgPFJlc291cmNlSGVhZGVyIHsuLi5wcm9wc30gLz5cbiAgICAgIFxuICAgICAgPEJveCB2YXJpYW50PVwid2hpdGVcIiBwYWRkaW5nPVwieGxcIiBib3JkZXJSYWRpdXM9XCJsZ1wiIGJveFNoYWRvdz1cImNhcmRcIj5cbiAgICAgICAgPEJveCBmbGV4IGZsZXhEaXJlY3Rpb249XCJyb3dcIiBqdXN0aWZ5Q29udGVudD1cInNwYWNlLWJldHdlZW5cIiBhbGlnbkl0ZW1zPVwiY2VudGVyXCIgbWFyZ2luQm90dG9tPVwieGxcIj5cbiAgICAgICAgICA8SDM+e3Jlc291cmNlLm5hbWV9IExpc3Q8L0gzPlxuICAgICAgICAgIDxCdXR0b24gdmFyaWFudD1cInByaW1hcnlcIiBvbkNsaWNrPXsoKSA9PiB3aW5kb3cubG9jYXRpb24uaHJlZiA9IGAke3dpbmRvdy5sb2NhdGlvbi5vcmlnaW59L2FkbWluL3Jlc291cmNlcy8ke3Jlc291cmNlLmlkfS9hY3Rpb25zL25ld2B9PlxuICAgICAgICAgICAgPEljb24gaWNvbj1cIkFkZFwiIC8+XG4gICAgICAgICAgICBDcmVhdGUgTmV3XG4gICAgICAgICAgPC9CdXR0b24+XG4gICAgICAgIDwvQm94PlxuXG4gICAgICAgIHtsb2FkaW5nID8gKFxuICAgICAgICAgIDxCb3ggZmxleCBqdXN0aWZ5Q29udGVudD1cImNlbnRlclwiIHBhZGRpbmc9XCJ4bFwiPjxMb2FkZXIgLz48L0JveD5cbiAgICAgICAgKSA6IChcbiAgICAgICAgICA8PlxuICAgICAgICAgICAgPFRhYmxlPlxuICAgICAgICAgICAgICA8VGFibGVIZWFkPlxuICAgICAgICAgICAgICAgIDxUYWJsZVJvdz5cbiAgICAgICAgICAgICAgICAgIHtyZXNvdXJjZS5saXN0UHJvcGVydGllcy5zbGljZSgwLCA1KS5tYXAocHJvcCA9PiAoXG4gICAgICAgICAgICAgICAgICAgIDxUYWJsZUNlbGwga2V5PXtwcm9wLm5hbWV9Pntwcm9wLmxhYmVsfTwvVGFibGVDZWxsPlxuICAgICAgICAgICAgICAgICAgKSl9XG4gICAgICAgICAgICAgICAgICA8VGFibGVDZWxsPkFjdGlvbnM8L1RhYmxlQ2VsbD5cbiAgICAgICAgICAgICAgICA8L1RhYmxlUm93PlxuICAgICAgICAgICAgICA8L1RhYmxlSGVhZD5cbiAgICAgICAgICAgICAgPFRhYmxlQm9keT5cbiAgICAgICAgICAgICAgICB7ZGF0YS5tYXAocmVjb3JkID0+IChcbiAgICAgICAgICAgICAgICAgIDxUYWJsZVJvdyBrZXk9e3JlY29yZC5pZH0+XG4gICAgICAgICAgICAgICAgICAgIHtyZXNvdXJjZS5saXN0UHJvcGVydGllcy5zbGljZSgwLCA1KS5tYXAocHJvcCA9PiAoXG4gICAgICAgICAgICAgICAgICAgICAgPFRhYmxlQ2VsbCBrZXk9e3Byb3AubmFtZX0+XG4gICAgICAgICAgICAgICAgICAgICAgICB7cmVjb3JkLnBhcmFtc1twcm9wLm5hbWVdPy50b1N0cmluZygpIHx8ICctJ31cbiAgICAgICAgICAgICAgICAgICAgICA8L1RhYmxlQ2VsbD5cbiAgICAgICAgICAgICAgICAgICAgKSl9XG4gICAgICAgICAgICAgICAgICAgIDxUYWJsZUNlbGw+XG4gICAgICAgICAgICAgICAgICAgICAgPEJ1dHRvbiBzaXplPVwiaWNvblwiIHZhcmlhbnQ9XCJ0ZXh0XCIgb25DbGljaz17KCkgPT4gd2luZG93LmxvY2F0aW9uLmhyZWYgPSBgJHt3aW5kb3cubG9jYXRpb24ub3JpZ2lufS9hZG1pbi9yZXNvdXJjZXMvJHtyZXNvdXJjZS5pZH0vcmVjb3Jkcy8ke3JlY29yZC5pZH0vc2hvd2B9PlxuICAgICAgICAgICAgICAgICAgICAgICAgPEljb24gaWNvbj1cIlZpZXdcIiAvPlxuICAgICAgICAgICAgICAgICAgICAgIDwvQnV0dG9uPlxuICAgICAgICAgICAgICAgICAgICAgIDxCdXR0b24gc2l6ZT1cImljb25cIiB2YXJpYW50PVwidGV4dFwiIG9uQ2xpY2s9eygpID0+IHdpbmRvdy5sb2NhdGlvbi5ocmVmID0gYCR7d2luZG93LmxvY2F0aW9uLm9yaWdpbn0vYWRtaW4vcmVzb3VyY2VzLyR7cmVzb3VyY2UuaWR9L3JlY29yZHMvJHtyZWNvcmQuaWR9L2VkaXRgfT5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxJY29uIGljb249XCJFZGl0XCIgLz5cbiAgICAgICAgICAgICAgICAgICAgICA8L0J1dHRvbj5cbiAgICAgICAgICAgICAgICAgICAgPC9UYWJsZUNlbGw+XG4gICAgICAgICAgICAgICAgICA8L1RhYmxlUm93PlxuICAgICAgICAgICAgICAgICkpfVxuICAgICAgICAgICAgICA8L1RhYmxlQm9keT5cbiAgICAgICAgICAgIDwvVGFibGU+XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIHttZXRhLnRvdGFsID4gbWV0YS5wZXJQYWdlICYmIChcbiAgICAgICAgICAgICAgPEJveCBmbGV4IGp1c3RpZnlDb250ZW50PVwiY2VudGVyXCIgbWFyZ2luVG9wPVwieGxcIj5cbiAgICAgICAgICAgICAgICA8UGFnaW5hdGlvbiBcbiAgICAgICAgICAgICAgICAgIHRvdGFsPXttZXRhLnRvdGFsfSBcbiAgICAgICAgICAgICAgICAgIHBlclBhZ2U9e21ldGEucGVyUGFnZX0gXG4gICAgICAgICAgICAgICAgICBwYWdlPXtwYWdlfSBcbiAgICAgICAgICAgICAgICAgIG9uQ2hhbmdlPXtvblBhZ2VDaGFuZ2V9XG4gICAgICAgICAgICAgICAgLz5cbiAgICAgICAgICAgICAgPC9Cb3g+XG4gICAgICAgICAgICApfVxuICAgICAgICAgIDwvPlxuICAgICAgICApfVxuICAgICAgPC9Cb3g+XG4gICAgPC9Cb3g+XG4gICk7XG59O1xuXG5leHBvcnQgZGVmYXVsdCBSZXNvdXJjZUxpc3Q7XG4iLCJBZG1pbkpTLlVzZXJDb21wb25lbnRzID0ge31cbmltcG9ydCBEYXNoYm9hcmQgZnJvbSAnLi4vc3JjL2FkbWluL2NvbXBvbmVudHMvb3ZlcnZpZXcnXG5BZG1pbkpTLlVzZXJDb21wb25lbnRzLkRhc2hib2FyZCA9IERhc2hib2FyZFxuaW1wb3J0IFJlc291cmNlTGlzdCBmcm9tICcuLi9zcmMvYWRtaW4vY29tcG9uZW50cy9yZXNvdXJjZS1saXN0J1xuQWRtaW5KUy5Vc2VyQ29tcG9uZW50cy5SZXNvdXJjZUxpc3QgPSBSZXNvdXJjZUxpc3QiXSwibmFtZXMiOlsiRXJyb3JCYXJDaGFydCIsInN0YXRzIiwibGVuZ3RoIiwiUmVhY3QiLCJjcmVhdGVFbGVtZW50IiwibWF4Q291bnQiLCJNYXRoIiwibWF4IiwibWFwIiwicyIsImNvdW50Iiwic3R5bGUiLCJmbGV4IiwiYmFja2dyb3VuZCIsInBhZGRpbmciLCJib3JkZXJSYWRpdXMiLCJib3hTaGFkb3ciLCJib3JkZXIiLCJtYXJnaW4iLCJjb2xvciIsImZvbnRTaXplIiwiZm9udFdlaWdodCIsImRpc3BsYXkiLCJhbGlnbkl0ZW1zIiwianVzdGlmeUNvbnRlbnQiLCJoZWlnaHQiLCJnYXAiLCJwYWRkaW5nVG9wIiwia2V5IiwiZGF5IiwiZmxleERpcmVjdGlvbiIsIndpZHRoIiwidHJhbnNpdGlvbiIsInBvc2l0aW9uIiwidG9wIiwibGVmdCIsInRyYW5zZm9ybSIsIm1hcmdpblRvcCIsInNwbGl0Iiwic2xpY2UiLCJGbG93RG9udXRDaGFydCIsInRvdGFsIiwicmVkdWNlIiwiYWNjIiwiY3VyciIsImN1bXVsYXRpdmUiLCJjb2xvcnMiLCJncmFkaWVudFBhcnRzIiwiaSIsInN0YXJ0IiwiZW5kIiwiam9pbiIsIm1hcmdpbkJvdHRvbSIsInRleHRUcmFuc2Zvcm0iLCJuYW1lIiwibWF4V2lkdGgiLCJvdmVyZmxvdyIsInRleHRPdmVyZmxvdyIsIndoaXRlU3BhY2UiLCJyb3VuZCIsIkVuZHBvaW50UmFua2luZyIsIk92ZXJ2aWV3IiwicHJvcHMiLCJkYXRhIiwic2V0RGF0YSIsInVzZVN0YXRlIiwibG9hZGluZyIsInNldExvYWRpbmciLCJmbG93U3RhdHMiLCJhcGkiLCJBcGlDbGllbnQiLCJ1c2VFZmZlY3QiLCJnZXREYXNoYm9hcmQiLCJ0aGVuIiwicmVzcG9uc2UiLCJjYXRjaCIsImVyciIsImNvbnNvbGUiLCJlcnJvciIsInRleHRBbGlnbiIsIm1pbkhlaWdodCIsImJvcmRlclRvcENvbG9yIiwiYW5pbWF0aW9uIiwiZm9udEZhbWlseSIsImdyaWRUZW1wbGF0ZUNvbHVtbnMiLCJsYWJlbCIsInZhbHVlIiwidXNlckNvdW50IiwibWVzc2FnZUNvdW50IiwiZXJyb3JDb3VudCIsImlzRGFuZ2VyIiwiY2FyZCIsImxldHRlclNwYWNpbmciLCJmbGV4V3JhcCIsImVycm9yU3RhdHMiLCJlbmRwb2ludFN0YXRzIiwiRGF0ZSIsInRvTG9jYWxlVGltZVN0cmluZyIsIlJlc291cmNlSGVhZGVyIiwicmVzb3VyY2UiLCJhY3Rpb24iLCJtZXRhIiwicmVzb3VyY2VOYW1lIiwiZ2V0UmVzb3VyY2VDb25maWciLCJpY29uIiwiY29uZmlnIiwiQm94IiwidmFyaWFudCIsImJhY2tncm91bmRDb2xvciIsInZpZXdCb3giLCJmaWxsIiwic3Ryb2tlIiwic3Ryb2tlV2lkdGgiLCJzdHJva2VMaW5lY2FwIiwic3Ryb2tlTGluZWpvaW4iLCJGcmFnbWVudCIsImQiLCJjeCIsImN5IiwiciIsInBvaW50cyIsIkgzIiwiVGV4dCIsInNpemUiLCJPYmplY3QiLCJlbnRyaWVzIiwicmVwbGFjZSIsIlJlc291cmNlTGlzdCIsInNldE1ldGEiLCJwYWdlIiwic2V0UGFnZSIsInNlbmROb3RpY2UiLCJ1c2VOb3RpY2UiLCJmZXRjaERhdGEiLCJwYWdlTnVtIiwicmVzb3VyY2VBY3Rpb24iLCJyZXNvdXJjZUlkIiwiaWQiLCJhY3Rpb25OYW1lIiwicGFyYW1zIiwicmVjb3JkcyIsIm1lc3NhZ2UiLCJ0eXBlIiwib25QYWdlQ2hhbmdlIiwibmV3UGFnZSIsIkJ1dHRvbiIsIm9uQ2xpY2siLCJ3aW5kb3ciLCJsb2NhdGlvbiIsImhyZWYiLCJvcmlnaW4iLCJJY29uIiwiTG9hZGVyIiwiVGFibGUiLCJUYWJsZUhlYWQiLCJUYWJsZVJvdyIsImxpc3RQcm9wZXJ0aWVzIiwicHJvcCIsIlRhYmxlQ2VsbCIsIlRhYmxlQm9keSIsInJlY29yZCIsInRvU3RyaW5nIiwicGVyUGFnZSIsIlBhZ2luYXRpb24iLCJvbkNoYW5nZSIsIkFkbWluSlMiLCJVc2VyQ29tcG9uZW50cyIsIkRhc2hib2FyZCJdLCJtYXBwaW5ncyI6Ijs7Ozs7OztFQUdBLE1BQU1BLGFBQWEsR0FBR0EsQ0FBQztFQUFFQyxFQUFBQTtFQUFNLENBQUMsS0FBSztFQUNuQyxFQUFBLElBQUksQ0FBQ0EsS0FBSyxJQUFJQSxLQUFLLENBQUNDLE1BQU0sS0FBSyxDQUFDLEVBQUUsb0JBQU9DLHNCQUFBLENBQUFDLGFBQUEsQ0FBQSxLQUFBLEVBQUEsSUFBQSxFQUFLLHlCQUE0QixDQUFDO0VBQzNFLEVBQUEsTUFBTUMsUUFBUSxHQUFHQyxJQUFJLENBQUNDLEdBQUcsQ0FBQyxHQUFHTixLQUFLLENBQUNPLEdBQUcsQ0FBQ0MsQ0FBQyxJQUFJQSxDQUFDLENBQUNDLEtBQUssQ0FBQyxFQUFFLENBQUMsQ0FBQztJQUV4RCxvQkFDRVAsc0JBQUEsQ0FBQUMsYUFBQSxDQUFBLEtBQUEsRUFBQTtFQUFLTyxJQUFBQSxLQUFLLEVBQUU7RUFBRUMsTUFBQUEsSUFBSSxFQUFFLENBQUM7RUFBRUMsTUFBQUEsVUFBVSxFQUFFLE1BQU07RUFBRUMsTUFBQUEsT0FBTyxFQUFFLE1BQU07RUFBRUMsTUFBQUEsWUFBWSxFQUFFLE1BQU07RUFBRUMsTUFBQUEsU0FBUyxFQUFFLGlDQUFpQztFQUFFQyxNQUFBQSxNQUFNLEVBQUU7RUFBb0I7S0FBRSxlQUM1SmQsc0JBQUEsQ0FBQUMsYUFBQSxDQUFBLElBQUEsRUFBQTtFQUFJTyxJQUFBQSxLQUFLLEVBQUU7RUFBRU8sTUFBQUEsTUFBTSxFQUFFLFlBQVk7RUFBRUMsTUFBQUEsS0FBSyxFQUFFLFNBQVM7RUFBRUMsTUFBQUEsUUFBUSxFQUFFLE1BQU07RUFBRUMsTUFBQUEsVUFBVSxFQUFFO0VBQU07RUFBRSxHQUFBLEVBQUMsMEJBQTRC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
