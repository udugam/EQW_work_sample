const styles = theme => ({
    root: {
        display: 'flex',
    },
    grow: {
        flexGrow: 1
    },
    tableContainer: {
        maxHeight: '60vh'
    
    },
    menuButton: {
        marginRight: theme.spacing(2),
    },
    dataSelect: {
        color: 'white',
        fontSize: '18px',
    },
    mainGrid: {
        paddingTop: '64px',
    },
    chartGrid: {
        paddingTop: '20px',
        paddingBottom: '30px',
    },
    dataTableGrid: {
        paddingTop: '30px',
        paddingBottom: '30px',
    },
    mapGrid: {
        paddingTop: '30px',
        paddingBottom: '30px',
    },
    textField: {
        margin: theme.spacing(1),
        width: 200,
    },
    loader: {
        padding: '20px',
        position: 'fixed',
        bottom: '25px',
        right: '25px'
    }
})

module.exports = styles