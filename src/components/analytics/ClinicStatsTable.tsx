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
import { ClinicStats } from '../../services/analyticsDaoService';

interface ClinicStatsTableProps {
  data: ClinicStats;
}

export const ClinicStatsTable: React.FC<ClinicStatsTableProps> = ({ data }) => {
  return (
    <Card>
      <CardContent>
        <Typography variant="h6" component="h2" gutterBottom>
          Статистика клінік
        </Typography>

        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Загальна кількість клінік: {data?.clinicStats?.totalClinics || 0} | Активні клініки: {data?.clinicStats?.activeClinics || 0}
        </Typography>

        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Дата</TableCell>
                <TableCell align="right">Нові клініки</TableCell>
                <TableCell align="right">Загальна кількість клінік</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data.clinicGrowth?.map((growth, index) => (
                <TableRow key={index}>
                  <TableCell>
                    <Typography variant="body2" fontWeight="medium">
                      {new Date(growth.date).toLocaleDateString('uk-UA')}
                    </Typography>
                  </TableCell>
                  <TableCell align="right">
                    <Typography variant="body2">
                      {growth.newClinics}
                    </Typography>
                  </TableCell>
                  <TableCell align="right">
                    <Typography variant="body2">
                      {growth.totalClinics}
                    </Typography>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        {(!data.clinicGrowth || data.clinicGrowth.length === 0) && (
          <Typography variant="body2" color="text.secondary" sx={{ mt: 2, textAlign: 'center' }}>
            Немає даних про ріст клінік
          </Typography>
        )}
      </CardContent>
    </Card>
  );
};