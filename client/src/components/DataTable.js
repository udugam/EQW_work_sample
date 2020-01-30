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
import debounce from 'lodash.debounce'


class DataTable extends Component {

    state = {
        searchText: '',
        lastEntry: '',
        timeoutId: '',
        results: [],
        headings: ['Points of Interest', 'Impressions', 'Clicks', 'Events', 'Revenue', 'Date'],
    }

    handleSearchTerm = (event) => {
        this.searchData(event.target.value)
    }

    searchData = (searchText=this.state.searchText) => {
        let options = {keys: ['poi.name'], id:"id", distance: 5, minMatchCharLength: 2};
        let fuse = new Fuse(this.props.rawData, options)
        let results = new Set(fuse.search(searchText))

        this.setState({results, searchText, lastEntry: Date.now()}, function() {
            // Create timeout to execute render function if input has stopped for a given time
            if(results.size > 0) {
                let timeoutId = setTimeout(() => this.setState(this.state),1500)
            }
        })
    }

    shouldComponentUpdate(nextProps,nextState) {
        // The logic here will debounce the render method to improve the performance of the search results
        if(nextState.lastEntry === '') return true  // Initial conditioned needed to render table
        if(nextState.searchText.length%5 === 0) return true // Render for every 5th character
        if(Date.now()-nextState.lastEntry > 1500) return true
    
        return false
    }

    componentDidUpdate(prevProps) {
        if(prevProps !== this.props) {
            this.searchData()
        }
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
                    <TextField id="search" onChange={this.handleSearchTerm} label="Search" className={classes.textField} variant="outlined"/>
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
                            <TableRow selected={this.state.results.has(index.toString())} key={index}>
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