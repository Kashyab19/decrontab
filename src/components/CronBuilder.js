// src/components/CronBuilder.js
// src/components/CronBuilder.js
import {
    Box,
    VStack,
    FormControl,
    FormLabel,
    Select,
    Input,
    Button,
    useToast,
  } from '@chakra-ui/react';
  import axios from 'axios';
  import { useState } from 'react';
  
  const CronBuilder = ({ setExecutionTimes, setExplanation }) => {
    const toast = useToast();
    const [formData, setFormData] = useState({
      minutes: '*',
      hours: '*',
      day_of_month: '*',
      month: '*',
      day_of_week: '*',
      command: '',
    });
  
    const handleSubmit = async () => {
      try {
        const response = await axios.post(
          'http://localhost:8000/api/v1/validate-crontab',
          formData
        );
        
        setExecutionTimes(response.data.next_executions);
        setExplanation(response.data.explanation);
        
        toast({
          title: 'Success',
          description: 'Cron expression is valid',
          status: 'success',
          duration: 3000,
        });
      } catch (error) {
        toast({
          title: 'Error',
          description: error.response?.data?.detail || 'Something went wrong',
          status: 'error',
          duration: 3000,
        });
      }
    };
  
    const handleChange = (field, value) => {
      setFormData(prev => ({ ...prev, [field]: value }));
    };
  
    return (
      <Box w="full" maxW="600px" p={6} borderWidth={1} borderRadius="lg">
        <VStack spacing={4}>
          <FormControl>
            <FormLabel>Minutes</FormLabel>
            <Select
              value={formData.minutes}
              onChange={(e) => handleChange('minutes', e.target.value)}
            >
              <option value="*">Every minute (*)</option>
              <option value="*/5">Every 5 minutes</option>
              <option value="*/15">Every 15 minutes</option>
              <option value="*/30">Every 30 minutes</option>
              <option value="0">At minute 0</option>
            </Select>
          </FormControl>
  
          <FormControl>
            <FormLabel>Hours</FormLabel>
            <Select
              value={formData.hours}
              onChange={(e) => handleChange('hours', e.target.value)}
            >
              <option value="*">Every hour (*)</option>
              <option value="*/2">Every 2 hours</option>
              <option value="*/4">Every 4 hours</option>
              <option value="0">At midnight</option>
            </Select>
          </FormControl>
  
          <FormControl>
            <FormLabel>Day of Month</FormLabel>
            <Select
              value={formData.day_of_month}
              onChange={(e) => handleChange('day_of_month', e.target.value)}
            >
              <option value="*">Every day (*)</option>
              <option value="1">1st day</option>
              <option value="15">15th day</option>
              <option value="L">Last day</option>
            </Select>
          </FormControl>
  
          <FormControl>
            <FormLabel>Month</FormLabel>
            <Select
              value={formData.month}
              onChange={(e) => handleChange('month', e.target.value)}
            >
              <option value="*">Every month (*)</option>
              <option value="*/3">Every 3 months</option>
              <option value="*/6">Every 6 months</option>
            </Select>
          </FormControl>
  
          <FormControl>
            <FormLabel>Day of Week</FormLabel>
            <Select
              value={formData.day_of_week}
              onChange={(e) => handleChange('day_of_week', e.target.value)}
            >
              <option value="*">Every day (*)</option>
              <option value="1-5">Weekdays</option>
              <option value="0,6">Weekends</option>
            </Select>
          </FormControl>
  
          <FormControl>
            <FormLabel>Command</FormLabel>
            <Input
              value={formData.command}
              onChange={(e) => handleChange('command', e.target.value)}
              placeholder="Enter command to execute"
            />
          </FormControl>
  
          <Button colorScheme="blue" onClick={handleSubmit} w="full">
            Validate Expression
          </Button>
        </VStack>
      </Box>
    );
  };
  
  export default CronBuilder;