import React from 'react';
import { Box, H3, Text, Illustration, ValueGroup, Button } from '@adminjs/design-system';

const ResourceHeader = (props) => {
  const { resource, action, meta } = props;
  const stats = meta?.stats || action.meta?.stats || {};
  const resourceName = resource.name;

  // Render different icons/colors based on resource
  const getResourceConfig = () => {
    switch(resourceName) {
      case 'User': return { color: '#6366f1', icon: 'User', label: 'User Analytics' };
      case 'Errors': return { color: '#ef4444', icon: 'Warning', label: 'Error Intelligence' };
      case 'Message': return { color: '#10b981', icon: 'Email', label: 'Communication Stats' };
      case 'Room': return { color: '#f59e0b', icon: 'Chat', label: 'Room Activity' };
      default: return { color: '#6366f1', icon: 'Activity', label: 'Overview' };
    }
  };

  const config = getResourceConfig();

  return (
    <Box variant="white" padding="xl" marginBottom="xl" borderRadius="lg" boxShadow="card">
      <Box flex flexDirection="row" alignItems="center" justifyContent="space-between" marginBottom="xl">
        <Box flex flexDirection="row" alignItems="center" gap="lg">
           <Box 
             backgroundColor={config.color} 
             padding="md" 
             borderRadius="md" 
             color="white"
             display="flex"
             alignItems="center"
             justifyContent="center"
           >
             {/* Simple SVG icon mapping */}
             <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
               {resourceName === 'User' && <><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></>}
               {resourceName === 'Errors' && <><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><path d="M12 9v4"/><path d="M12 17h.01"/></>}
               {resourceName === 'Message' && <><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></>}
               {resourceName === 'Room' && <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>}
             </svg>
           </Box>
           <Box>
             <H3 marginBottom="0" color="grey100">{config.label}</H3>
             <Text size="sm" color="grey60">{resourceName} management and real-time monitoring</Text>
           </Box>
        </Box>
      </Box>

      <Box display="grid" gridTemplateColumns="repeat(auto-fit, minmax(180px, 1fr))" gap="lg">
        {Object.entries(stats).map(([label, value]) => (
          <Box key={label} padding="lg" backgroundColor="grey20" borderRadius="md" border={`1px solid #e2e8f0`}>
            <Text color="grey60" size="xs" fontWeight="bold" textTransform="uppercase" letterSpacing="wider">{label.replace(/([A-Z])/g, ' $1')}</Text>
            <Text color="grey100" size="xl" fontWeight="800" marginTop="sm">{value}</Text>
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default ResourceHeader;
