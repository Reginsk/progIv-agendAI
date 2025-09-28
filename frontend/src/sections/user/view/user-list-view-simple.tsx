'use client';

import { useState, useCallback } from 'react';
// @mui
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import Container from '@mui/material/Container';
import TableBody from '@mui/material/TableBody';
import IconButton from '@mui/material/IconButton';
import TableContainer from '@mui/material/TableContainer';
// routes
import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';
import { RouterLink } from 'src/routes/components';
// hooks
import { useBoolean } from 'src/hooks/use-boolean';
// types
import { IUserItem } from 'src/types/user';
// api
import { useGetUsers, deleteUser } from 'src/api/user';
// components
import Iconify from 'src/components/iconify';
import Scrollbar from 'src/components/scrollbar';
import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import {
    useTable,
    getComparator,
    emptyRows,
    TableNoData,
    TableEmptyRows,
    TableHeadCustom,
    TableSelectedAction,
    TablePaginationCustom,
} from 'src/components/table';
import { useSnackbar } from 'src/components/snackbar';
import { ConfirmDialog } from 'src/components/custom-dialog';
//
import UserTableRow from '../user-table-row-simple';
import UserTableToolbar from '../user-table-toolbar-simple';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
    { id: 'name', label: 'Name' },
    { id: 'email', label: 'Email' },
    { id: 'role', label: 'Role', width: 120 },
    { id: 'created_at', label: 'Created At', width: 140 },
    { id: '', width: 88 },
];

const defaultFilters = {
    name: '',
    role: [],
};

// ----------------------------------------------------------------------

export default function UserListView() {
    const table = useTable();

    const settings = useSettingsContext();

    const router = useRouter();

    const confirm = useBoolean();

    const { enqueueSnackbar } = useSnackbar();

    const { users, usersLoading, usersEmpty } = useGetUsers();

    const [filters, setFilters] = useState(defaultFilters);

    const [tableData, setTableData] = useState<IUserItem[]>([]);

    const dataFiltered = applyFilter({
        inputData: users,
        comparator: getComparator(table.order, table.orderBy),
        filters,
    });

    const dataInPage = dataFiltered.slice(
        table.page * table.rowsPerPage,
        table.page * table.rowsPerPage + table.rowsPerPage
    );

    const denseHeight = table.dense ? 52 : 72;

    const canReset = !!filters.name || filters.role.length > 0;

    const notFound = (!dataFiltered.length && canReset) || (!dataFiltered.length && !usersLoading);

    const handleFilters = useCallback(
        (name: string, value: any) => {
            table.onResetPage();
            setFilters((prevState) => ({
                ...prevState,
                [name]: value,
            }));
        },
        [table]
    );

    const handleDeleteRow = useCallback(
        async (id: string) => {
            try {
                await deleteUser(id);
                enqueueSnackbar('User deleted successfully!');
                table.onUpdatePageDeleteRow(dataInPage.length);
            } catch (error) {
                console.error(error);
                enqueueSnackbar('Failed to delete user', { variant: 'error' });
            }
        },
        [enqueueSnackbar, dataInPage.length, table]
    );

    const handleDeleteRows = useCallback(
        async () => {
            try {
                await Promise.all(table.selected.map((id) => deleteUser(id)));
                enqueueSnackbar('Users deleted successfully!');
                table.onUpdatePageDeleteRows({
                    totalRows: tableData.length,
                    totalRowsInPage: dataInPage.length,
                    totalRowsFiltered: dataFiltered.length,
                });
            } catch (error) {
                console.error(error);
                enqueueSnackbar('Failed to delete users', { variant: 'error' });
            }
        },
        [enqueueSnackbar, table, tableData.length, dataInPage.length, dataFiltered.length]
    );

    const handleEditRow = useCallback(
        (id: string) => {
            router.push(paths.dashboard.user.edit(id));
        },
        [router]
    );

    const handleResetFilters = useCallback(() => {
        setFilters(defaultFilters);
    }, []);

    return (
        <>
            <Container maxWidth={settings.themeStretch ? false : 'lg'}>
                <CustomBreadcrumbs
                    heading="User List"
                    links={[
                        { name: 'Dashboard', href: paths.dashboard.root },
                        { name: 'User', href: paths.dashboard.user.root },
                        { name: 'List' },
                    ]}
                    action={
                        <Button
                            component={RouterLink}
                            href={paths.dashboard.user.new}
                            variant="contained"
                            startIcon={<Iconify icon="mingcute:add-line" />}
                        >
                            New User
                        </Button>
                    }
                    sx={{
                        mb: { xs: 3, md: 5 },
                    }}
                />

                <Card>
                    <UserTableToolbar
                        filters={filters}
                        onFilters={handleFilters}
                        roleOptions={[
                            { value: 'admin', label: 'Admin' },
                            { value: 'user', label: 'User' },
                        ]}
                    />

                    {canReset && (
                        <TableSelectedAction
                            dense={table.dense}
                            numSelected={table.selected.length}
                            rowCount={tableData.length}
                            onSelectAllRows={(checked) =>
                                table.onSelectAllRows(
                                    checked,
                                    tableData.map((row) => row.id)
                                )
                            }
                            action={
                                <Tooltip title="Delete">
                                    <IconButton color="primary" onClick={confirm.onTrue}>
                                        <Iconify icon="solar:trash-bin-trash-bold" />
                                    </IconButton>
                                </Tooltip>
                            }
                        />
                    )}

                    <TableContainer sx={{ position: 'relative', overflow: 'unset' }}>
                        <Scrollbar>
                            <Table size={table.dense ? 'small' : 'medium'} sx={{ minWidth: 960 }}>
                                <TableHeadCustom
                                    order={table.order}
                                    orderBy={table.orderBy}
                                    headLabel={TABLE_HEAD}
                                    rowCount={tableData.length}
                                    numSelected={table.selected.length}
                                    onSort={table.onSort}
                                    onSelectAllRows={(checked) =>
                                        table.onSelectAllRows(
                                            checked,
                                            tableData.map((row) => row.id)
                                        )
                                    }
                                />

                                <TableBody>
                                    {dataFiltered
                                        .slice(
                                            table.page * table.rowsPerPage,
                                            table.page * table.rowsPerPage + table.rowsPerPage
                                        )
                                        .map((row) => (
                                            <UserTableRow
                                                key={row.id}
                                                row={row}
                                                selected={table.selected.includes(row.id)}
                                                onSelectRow={() => table.onSelectRow(row.id)}
                                                onDeleteRow={() => handleDeleteRow(row.id)}
                                                onEditRow={() => handleEditRow(row.id)}
                                            />
                                        ))}

                                    <TableEmptyRows
                                        height={denseHeight}
                                        emptyRows={emptyRows(table.page, table.rowsPerPage, tableData.length)}
                                    />

                                    <TableNoData notFound={notFound} />
                                </TableBody>
                            </Table>
                        </Scrollbar>
                    </TableContainer>

                    <TablePaginationCustom
                        count={dataFiltered.length}
                        page={table.page}
                        rowsPerPage={table.rowsPerPage}
                        onPageChange={table.onChangePage}
                        onRowsPerPageChange={table.onChangeRowsPerPage}
                        dense={table.dense}
                        onChangeDense={table.onChangeDense}
                    />
                </Card>
            </Container>

            <ConfirmDialog
                open={confirm.value}
                onClose={confirm.onFalse}
                title="Delete"
                content={
                    <>
                        Are you sure want to delete <strong> {table.selected.length} </strong> items?
                    </>
                }
                action={
                    <Button
                        variant="contained"
                        color="error"
                        onClick={() => {
                            handleDeleteRows();
                            confirm.onFalse();
                        }}
                    >
                        Delete
                    </Button>
                }
            />
        </>
    );
}

// ----------------------------------------------------------------------

function applyFilter({
    inputData,
    comparator,
    filters,
}: {
    inputData: IUserItem[];
    comparator: (a: any, b: any) => number;
    filters: { name: string; role: string[] };
}) {
    const { name, role } = filters;

    const stabilizedThis = inputData.map((el, index) => [el, index] as const);

    stabilizedThis.sort((a, b) => {
        const order = comparator(a[0], b[0]);
        if (order !== 0) return order;
        return a[1] - b[1];
    });

    inputData = stabilizedThis.map((el) => el[0]);

    if (name) {
        inputData = inputData.filter(
            (user) => user.name.toLowerCase().indexOf(name.toLowerCase()) !== -1
        );
    }

    if (role.length) {
        inputData = inputData.filter((user) => role.includes(user.role));
    }

    return inputData;
}