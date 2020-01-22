import React, {Component} from 'react'
import {
    TableContainer,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    TextField,
    Typography,
    withStyles,
    Grid
} from '@material-ui/core'
import NumberFormat from 'react-number-format'
import moment from 'moment'
import Fuse from 'fuse.js'
import styles from '../styles.js'

class DataTable extends Component {

    state = {
        searchTerm: '',
        results: [],
        headings: ['Points of Interest', 'Impressions', 'Clicks', 'Events', 'Revenue', 'Date']
    }

    handleSearchTerm = (event) => {
        this.setState({searchTerm : event.target.value}, () => this.searchData(this.state.searchTerm))
    }

    searchData = (searchText) => {
        let options = {keys: ['poi.name'], id:"id"};
        let fuse = new Fuse(this.props.rawData, options)
        let results = fuse.search(searchText)
        this.setState({results}, this.render)
    }

    render() {
        const {classes} = this.props
        return(
            <Grid
                container
                direction="column"
                justify="center"
                alignItems="center"
                className={classes.dataTableGrid}
            >
                <Typography variant="h4">
                  Data Table w/ Fuzzy Search
                </Typography>
                <form noValidate autoComplete="off">
                    <TextField id="search" onChange={this.handleSearchTerm} value={this.state.searchTerm} label="Search" className={classes.textField} variant="outlined"/>
                </form>
                <TableContainer className={classes.tableContainer}>
                    <Table size="small" aria-label="a dense table">
                        <TableHead>
                        <TableRow>
                        {this.state.headings.map( (heading, index) => (
                            <TableCell key={index}>{heading}</TableCell>
                        ))}                        
                        </TableRow>
                        </TableHead>
                        <TableBody>
                        {this.props.rawData.map( (data,index) => (
                            <TableRow selected={this.state.results.toString().includes(index)} key={index}>
                                <TableCell> {data.poi.name} </TableCell>
                                <TableCell> {data.impressions} </TableCell> 
                                <TableCell> {data.clicks} </TableCell> 
                                <TableCell> {data.events} </TableCell> 
                                <TableCell> 
                                    <NumberFormat value={data.revenue} displayType="text" prefix="$" thousandSeparator={true} decimalScale={2} fixedDecimalScale={true} />
                                </TableCell> 
                                <TableCell> {moment(data.date).format("dddd, MMMM Do YYYY, h:mm:ss a")} </TableCell> 
                            </TableRow> 
                        ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Grid>
        )
    }
}

export default withStyles(styles)(DataTable)