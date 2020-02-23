

import { StyleSheet } from 'react-native';
import styleConstants from './constants';


const styles = StyleSheet.create({
	verticalCenter: {
		flex: 1,
		flexDirection: 'column',
		justifyContent: 'center', 
		alignItems: 'center',
	},
	verticalTop: {
		flex: 1,
		flexDirection: 'column',
		justifyContent: 'flex-start', 
		alignItems: 'flex-start',
	},
	horizontalCenter: {
		flex: 1,
		flexDirection: 'row',
		justifyContent: 'center', 
		alignItems: 'center',
	},
	horizontalFlex: {
		flex: 1,
		flexDirection: 'row'
	},
	textCenter: { textAlign: 'center' },
	textLeft: { textAlign: 'left' },
	width100: { alignSelf: 'stretch' },
	screenWrapper: { padding: 5 },
	p5: { padding: 5 },
	p10: { padding: 10 },
	p15: { padding: 15 },
	px5: { paddingLeft: 5, paddingRight: 5 },
	px10: { paddingLeft: 10, paddingRight: 10 },
	px15: { paddingLeft: 15, paddingRight: 15 },
	mx5: { marginLeft: 5, marginRight: 5 },
	mx10: { marginLeft: 10, marginRight: 10 },
	mx15: { marginLeft: 15, marginRight: 15 },
	mt5: { marginTop: 5 },
	mt10: { marginTop: 10 },
	mt15: { marginTop: 15 },
	shadow1: {
		shadowColor: "#000",
		shadowOffset: {
			width: 0,
			height: 5,
		},
		shadowOpacity: 0.34,
		shadowRadius: 6.27,

		elevation: 10,
	},
	inputBlueUnderline: {
		borderWidth: 0,
		borderBottomWidth: 1,
		borderColor: styleConstants.primaryBlue
	},
	inputMultiline: {
		borderWidth: 0,
		borderRadius: 15,
		backgroundColor: styleConstants.mildBlue,
	},
	buttonBase: {
		marginLeft: 2.5,
		height: 50,
		backgroundColor: '#00000000',
		borderWidth: 3,
		borderColor: styleConstants.primaryBlue
	},
	buttonBasePink: {
		marginLeft: 2.5,
		height: 50,
		backgroundColor: '#00000000',
		borderWidth: 3,
		borderColor: styleConstants.primaryPink
	},
});

export default styles;
