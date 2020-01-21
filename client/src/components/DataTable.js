import React, {Component, Fragment} from 'react'
import {
    TableContainer,
    Table,
    TableHead,
    TableRow,
    TableCell,
    Paper,
    TableBody,
    TextField,
    Typography
} from '@material-ui/core'
import NumberFormat from 'react-number-format'
import moment from 'moment'
import Fuse from 'fuse.js'

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
        return(
            <Fragment>
                <Typography variant="h4">
                  Data Table w/ Fuzzy Search
                </Typography>
                <form noValidate autoComplete="off">
                    <TextField id="search" onChange={this.handleSearchTerm} value={this.state.searchTerm} label="Search" />
                </form>
                <TableContainer component={Paper}>
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
            </Fragment>
        )
    }
}

export default DataTable