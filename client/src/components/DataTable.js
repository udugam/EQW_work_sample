import React, {Component, Fragment} from 'react'
import {
    TableContainer,
    Table,
    TableHead,
    TableRow,
    TableCell,
    Paper,
    TableBody,
    TextField
} from '@material-ui/core'

class DataTable extends Component {

    state = {
        searchTerm: '',
        results: []
    }

    handleSearchTerm = (event) => {
        this.setState({searchTerm : event.target.value}, () => this.searchData(this.state.searchTerm))
    }

    searchData = (searchText) => {
        let results = []
        if( searchText.length > 0) {
            this.props.data.map( (row,index) => {
                let rowString = row.toString()
                if(rowString.includes(searchText)) results.push(index)
            })
        }
        this.setState({results}, this.render)
    }

    render() {
        return(
            <Fragment>
                <form noValidate autoComplete="off">
                    <TextField id="search" onChange={this.handleSearchTerm} value={this.state.searchTerm} label="Search" />
                </form>
                <TableContainer component={Paper}>
                    <Table size="small" aria-label="a dense table">
                        <TableHead>
                        <TableRow>
                        {this.props.headings.map( (heading, index) => (
                            <TableCell key={index}>{heading}</TableCell>
                        ))}                        
                        </TableRow>
                        </TableHead>
                        <TableBody>
                        {this.props.data.map( (stat,index) => (
                            <TableRow selected={this.state.results.toString().includes(index)} key={index}>
                            {stat.map( (metric, index) => (
                                <TableCell key={index} align="right">{metric}</TableCell>    
                            ))} 
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