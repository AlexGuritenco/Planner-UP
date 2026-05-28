import {Button, Dialog, DialogActions, DialogContent, DialogTitle} from '@mui/material';

export default function ConfirmDialog({
    open,
    title,
    message,
    onCancel,
    onOK,
    className,
    confirmLabel = 'Confirm',
}) {
    return (
        <Dialog open={open} onClose={onCancel} className={className}>
            <DialogTitle>{title}</DialogTitle>
            <DialogContent dividers>{message}</DialogContent>
            <DialogActions>
                <Button
                    onClick={onCancel}
                >Cancel
                </Button>
                <Button
                    onClick={onOK}
                    variant="contained" autoFocus
                >
                    {confirmLabel}
                </Button>
            </DialogActions>
        </Dialog>
    );
}
