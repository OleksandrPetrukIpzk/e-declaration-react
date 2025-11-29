import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from '@mui/material';
import { DoctorPerformanceStats } from '../../services/analyticsDaoService';

interface DoctorPerformanceTableProps {
  data: DoctorPerformanceStats;
}

export const DoctorPerformanceTable: React.FC<DoctorPerformanceTableProps> = ({ data }) => {

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" component="h2" gutterBottom>
          Продуктивність лікарів
        </Typography>

        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Загальна кількість лікарів: {data?.doctorStats?.length || 0}
        </Typography>

        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Ім'я лікаря</TableCell>
                <TableCell align="right">Всього декларацій</TableCell>
                <TableCell align="right">Активні декларації</TableCell>
                <TableCell align="right">Відхилені декларації</TableCell>
                <TableCell align="right">Середній час обробки (год)</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data.doctorStats?.map((doctor) => (
                <TableRow key={doctor.doctorId}>
                  <TableCell>
                    <Typography variant="body2" fontWeight="medium">
                      {doctor.doctorName}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      ID: {doctor.doctorId}
                    </Typography>
                  </TableCell>
                  <TableCell align="right">
                    <Typography variant="body2">
                      {doctor.totalDeclarations}
                    </Typography>
                  </TableCell>
                  <TableCell align="right">
                    <Typography variant="body2">
                      {doctor.activeDeclarations}
                    </Typography>
                  </TableCell>
                  <TableCell align="right">
                    <Typography variant="body2">
                      {doctor.rejectedDeclarations}
                    </Typography>
                  </TableCell>
                  <TableCell align="right">
                    <Typography variant="body2">
                      {parseFloat(doctor.avgProcessingHours).toFixed(2)}
                    </Typography>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        {(!data.doctorStats || data.doctorStats.length === 0) && (
          <Typography variant="body2" color="text.secondary" sx={{ mt: 2, textAlign: 'center' }}>
            Немає даних про продуктивність лікарів
          </Typography>
        )}
      </CardContent>
    </Card>
  );
};