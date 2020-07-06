import React, { FunctionComponent, useCallback } from 'react';
import { Button } from '@material-ui/core';

/*
 * FOR TEST PURPOSES ONLY
 *
 * Button to list USB devices accessible from the borwser.
 * Experimental API, works only in Chrome.
 */
export const UsbDevicesButton: FunctionComponent = () => {
	const onClick = useCallback(async () => {
		if (!(navigator as any).usb || !(navigator as any).usb.getDevices) {
			alert('WebUSB API not present');
			return;
		}

		let device: any;

		try {
			device = await (navigator as any).usb.requestDevice({filters: []});
		} catch (e) {
			alert(`Error fetching usb device: ${e.message}\n\n${JSON.stringify(e)}`);
			return;
		}

		console.log(device);

		const data = {
			deviceClass: device.deviceClass,
			deviceProtocol: device.deviceProtocol,
			deviceSubclass: device.deviceSubclass,
			deviceVersionMajor: device.deviceVersionMajor,
			deviceVersionMinor: device.deviceVersionMinor,
			deviceVersionSubminor: device.deviceVersionSubminor,
			manufacturerName: device.manufacturerName,
			opened: device.opened,
			productId: device.productId,
			productName: device.productName,
			serialNumber: device.serialNumber,
			usbVersionMajor: device.usbVersionMajor,
			usbVersionMinor: device.usbVersionMinor,
			usbVersionSubminor: device.usbVersionSubminor,
			vendorId: device.vendorId,
		};

		alert(JSON.stringify(data));
	}, []);

	return (
		<Button onClick={onClick}>
			List USB Devices
		</Button>
	);
};
