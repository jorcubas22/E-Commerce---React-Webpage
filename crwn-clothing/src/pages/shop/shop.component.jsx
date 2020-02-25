import React from 'react';
import {Route} from 'react-router-dom';
import {connect} from 'react-redux';

import WithSpinner from '../../components/with-spinner/with-spinner.component';

import CollectionOverview from '../../components/collections-overview/collections-overview.component';
import CollectionPage from '../collection/collection.component';
import { updateCollections } from '../../redux/shop/shop.actions';
import {firestore, convertCollectionSnapshotToMap} from '../../firebase/firebase.utils'; 

const CollectionOverviewWithSpinner = WithSpinner(CollectionOverview);
const CollectionPageWithSpinner = WithSpinner(CollectionPage);

class ShopPage extends React.Component {
    // no need to write constructr and super
    // state is invoked by deafult
    state = {
        loading: true
    }

    unsubscribeFromSnapshot = null;

    componentDidMount() {
        const {updateCollections} = this.props;
        const collectionRef = firestore.collection('collections');

        // When this code is ran for the first time or the 
        // collectionRef updates, firebase will send use the
        // database of collectionRef

        this.unsubscribeFromSnapshot = collectionRef.onSnapshot(async snapshot => {
            const collectionsMap = convertCollectionSnapshotToMap(snapshot);
            updateCollections(collectionsMap);
            this.setState({loading:false});
        })
    }

    render(){
        const {match} = this.props;
        const {loading} = this.state;
        return (
            <div className='shop-page'>
                <Route exact path={`${match.path}`} render = {props => (<CollectionOverviewWithSpinner isLoading={loading} {...props} />)} />
                <Route path={`${match.path}/:collectionId`} render = {props => (<CollectionOverviewWithSpinner isLoading={loading} {...props} />)} />
            </div>
        );
    }
};      

const mapDispatchToProps = dispatch => ({
    updateCollections: collectionsMap => dispatch(updateCollections(collectionsMap))
})

export default connect(null, mapDispatchToProps)(ShopPage); 