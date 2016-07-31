import React, { Component, PropTypes } from 'react'
import { reduxForm } from 'redux-form';
import metadataEvaluator from './metadata/evaluator/metadataEvaluator';
import modelParser from './metadata/model/modelParser';
import { Form } from 'react-bootstrap';
import UIManager from './UIManager';

class AutoFormInternal extends Component {
    static propTypes = {
        uiType: PropTypes.string,
        fields: PropTypes.object.isRequired,
        handleSubmit: PropTypes.func.isRequired,
        resetForm: PropTypes.func.isRequired,
        submitting: PropTypes.bool.isRequired,
        componentFactory: PropTypes.object,
        entity: PropTypes.object.isRequired,
        layout: PropTypes.object,
        buttonBar: PropTypes.func.isRequired,
        fieldLayout: PropTypes.string
    };

    getFactory() {
        const { uiType, componentFactory } = this.props;

        if (!uiType) {
            return componentFactory;
        }

        return UIManager.getFactoryPerType(uiType);
    }

    buildGroupComponent = () => {
        //Fields: this is not the fields passed from AutoForm. This is generated by ReduxForm. 
        //This object has a property for each field. Each property contains all redux props for the given field
        let { fields, fieldMetadata, layout, values } = this.props;
        let modelProcessed = modelParser.process(values, fieldMetadata);
        let fieldMetadataEvaluated = metadataEvaluator.evaluate(fieldMetadata, modelProcessed, '', fields);
        let componentFactory = this.getFactory();

        return componentFactory.buildGroupComponent({
            component: layout.component,
            layout: layout,
            fields: fieldMetadataEvaluated,
            componentFactory: componentFactory
        });
    }; 
    
    render() {
        let { handleSubmit, submitting, buttonBar, fieldLayout } = this.props;
        let groupComponent = this.buildGroupComponent();
        
        return (
            <div className="meta-form">
                <Form onSubmit={handleSubmit} horizontal={fieldLayout == 'inline'}>
                    { groupComponent }
                    { React.createElement(buttonBar, { submitting: submitting }) }
                </Form>
            </div>
        )
    }
}

export default reduxForm()(AutoFormInternal);