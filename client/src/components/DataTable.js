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

class DataTable extends Component {

    state = {
        searchTerm: '',
        results: [],
        headings: ['Date', 'Clicks', 'Revenue', 'Events', 'Points of Interest']
    }

    handleSearchTerm = (event) => {
        this.setState({searchTerm : event.target.value}, () => this.searchData(this.state.searchTerm))
    }

    searchData = (searchText) => {
        let results = []
        if( searchText.length > 0) {
            this.props.data.map( (row,index) => {
                let rowString = row.toString()
                if(rowString.includes(searchText)) return results.push(index)
                return null
            })
        }
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
                                <TableCell align="right">{data.date}</TableCell> 
                                <TableCell align="right">{data.clicks}</TableCell> 
                                <TableCell align="right">{data.revenue}</TableCell> 
                                <TableCell align="right">{data.events}</TableCell> 
                                <TableCell align="right">{data.poi.name}</TableCell>
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