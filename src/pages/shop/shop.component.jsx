import React from 'react';
import CollectionsOverview from '../../components/collections-overview/collections.overview.component';
import {Route} from 'react-router-dom';
import CollectionPage from '../collection/collection.component';
import { firestore, convertCollectionsSnapshotToMap } from '../../firebase/firebase.utils';
import {connect} from 'react-redux';
import {updateCollections} from '../../redux/shop/shop.actions';
import {WithSpinner} from '../../components/with-spinner/with-spinner.component';

const CollectionOverviewWithSpinner = WithSpinner(CollectionsOverview);
const CollectionPageWithSpinner = WithSpinner(CollectionPage);


class ShopPage extends React.Component{

    state = {
        isLoading: true
    };

    unsubscribeFromSnapshot = null;

    componentDidMount() {
        const {updateCollections} = this.props;

        const collectionRef = firestore.collection('collections');
       this.unsubscribeFromSnapshot = collectionRef.onSnapshot(async snapshot => {
            const collectionMap = convertCollectionsSnapshotToMap(snapshot);
            updateCollections(collectionMap);
            this.setState({isLoading: false});
        })
    }

    componentWillUnmount() {
        this.unsubscribeFromSnapshot();
    }

    render() {
       const {match} = this.props;
       const {isLoading} = this.state;
       return (
           <div className='shop-page'>
               <Route exact path={`${match.path}`} render={(props) => <CollectionOverviewWithSpinner isLoading={isLoading} {...props} />} />
               <Route path={`${match.path}/:collectionId`} render={(props) => <CollectionPageWithSpinner isLoading={isLoading} {...props} />} />
           </div>
       );
   }
}

const mapDispatchToProps = dispatch => ({
updateCollections: collectionsMap => dispatch(updateCollections(collectionsMap))
});

export default connect(null, mapDispatchToProps)(ShopPage);