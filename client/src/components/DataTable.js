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
        searchTerm: '',
        results: [],
        headings: ['Points of Interest', 'Impressions', 'Clicks', 'Events', 'Revenue', 'Date'],
    }

    handleSearchTerm = (event) => {
        // this.setState({searchTerm : event.target.value}, debounce(this.searchData,4000, {leading:true, trailing:true}))
        this.setState({searchTerm : event.target.value}, this.searchData)
    }

    searchData = (searchText=this.state.searchTerm) => {
        let options = {keys: ['poi.name'], id:"id", distance: 5, minMatchCharLength: 2};
        let fuse = new Fuse(this.props.rawData, options)
        console.log(fuse)
        let results = new Set(fuse.search(searchText))
        this.setState({results}, this.render)
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