import React, { useState, useEffect } from 'react';
import { ApiClient, useNotice } from 'adminjs';
import { Box, Table, TableHead, TableBody, TableRow, TableCell, H3, Text, Button, Icon, Pagination, Loader } from '@adminjs/design-system';
import ResourceHeader from './resource-header.jsx';

const ResourceList = (props) => {
  const { resource, action } = props;
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [meta, setMeta] = useState({});
  const [page, setPage] = useState(1);
  const api = new ApiClient();
  const sendNotice = useNotice();

  const fetchData = async (pageNum = 1) => {
    setLoading(true);
    try {
      const response = await api.resourceAction({
        resourceId: resource.id,
        actionName: 'list',
        params: { page: pageNum }
      });
      setData(response.data.records);
      setMeta(response.data.meta);
      setPage(pageNum);
    } catch (err) {
      sendNotice({ message: 'Error fetching data', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [resource.id]);

  const onPageChange = (newPage) => {
    fetchData(newPage);
  };

  return (
    <Box padding="xl">
      <ResourceHeader {...props} meta={meta} />
      
      <Box variant="white" padding="xl" borderRadius="lg" boxShadow="card">
        <Box flex flexDirection="row" justifyContent="space-between" alignItems="center" marginBottom="xl">
          <H3>{resource.name} List</H3>
          <Button variant="primary" onClick={() => window.location.href = `${window.location.origin}/admin/resources/${resource.id}/actions/new`}>
            <Icon icon="Add" />
            Create New
          </Button>
        </Box>

        {loading ? (
          <Box flex justifyContent="center" padding="xl"><Loader /></Box>
        ) : (
          <>
            <Table>
              <TableHead>
                <TableRow>
                  {resource.listProperties.slice(0, 5).map(prop => (
                    <TableCell key={prop.name}>{prop.label}</TableCell>
                  ))}
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {data.map(record => (
                  <TableRow key={record.id}>
                    {resource.listProperties.slice(0, 5).map(prop => (
                      <TableCell key={prop.name}>
                        {record.params[prop.name]?.toString() || '-'}
                      </TableCell>
                    ))}
                    <TableCell>
                      <Button size="icon" variant="text" onClick={() => window.location.href = `${window.location.origin}/admin/resources/${resource.id}/records/${record.id}/show`}>
                        <Icon icon="View" />
                      </Button>
                      <Button size="icon" variant="text" onClick={() => window.location.href = `${window.location.origin}/admin/resources/${resource.id}/records/${record.id}/edit`}>
                        <Icon icon="Edit" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            
            {meta.total > meta.perPage && (
              <Box flex justifyContent="center" marginTop="xl">
                <Pagination 
                  total={meta.total} 
                  perPage={meta.perPage} 
                  page={page} 
                  onChange={onPageChange}
                />
              </Box>
            )}
          </>
        )}
      </Box>
    </Box>
  );
};

export default ResourceList;
