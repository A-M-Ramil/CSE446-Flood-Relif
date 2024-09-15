// SPDX-License-Identifier: MIT

pragma solidity >=0.4.22 <0.9.0;

contract Fundraiser {
    error ERROR__Donor__Not__Registered();
    error ERROR__COLLECTOR__CANT__BE__A__DONATOR();
    error ERROR__NOT__ENOUGH__SENT__VALUE();
    error ERROR__NOT__ENOUGH__BALANCE();
    error ERROR__INVALID__FUND__ZONE();

    address public sylhetCollector = 0x1375b15E8960F6BE79a4204ddfC1cB3BD5d00d09;
    address public chittagongSouthCollector = 0x090920cD992E1F349ea00bbf59e9d11Eea492494;
    address public chittagongNorthCollector = 0xC23396C0648Ec35ab16EfBA2Fd2aA0B839966556;
    uint256 public accountNo = 0;

    uint256 private sylhetCollectorBalance_initial = sylhetCollector.balance;
    uint256 private chittagongSouthCollectorBalance_initial = chittagongSouthCollector.balance;
    uint256 private chittagongNorthCollectorBalance_initial = chittagongNorthCollector.balance;

    struct Donor {
        uint256 donorAccountNo;
        string name;
        string mobileNum;
    }

    mapping(string => Donor) private donors;
    mapping(address => Donor) private donorsAddress;

    function registerDonor(
        string memory _name,
        string memory _mobileNum
    ) public {
        if (
            msg.sender != chittagongSouthCollector &&
            msg.sender != chittagongNorthCollector &&
            msg.sender != sylhetCollector
        ) {
            Donor memory newDonor;

            newDonor.name = _name;
            newDonor.mobileNum = _mobileNum;
            accountNo++;
            newDonor.donorAccountNo = accountNo;
            donors[newDonor.mobileNum] = newDonor;
            donorsAddress[msg.sender] = newDonor;
        } else {
            revert ERROR__COLLECTOR__CANT__BE__A__DONATOR();
        }
    }

    function donate(
        string memory _mobile,
        string memory _fundZone
    ) public payable {
        if (donors[_mobile].donorAccountNo > 0) {
            if (msg.value > 0) {
                if (msg.sender.balance > 0) {
                    if (
                        keccak256(abi.encodePacked(_fundZone)) ==
                        keccak256(abi.encodePacked("Sylhet"))
                    ) {
                        payable(sylhetCollector).transfer(msg.value);
                    } else if (
                        keccak256(abi.encodePacked(_fundZone)) ==
                        keccak256(abi.encodePacked("Chittagong South"))
                    ) {
                        payable(chittagongSouthCollector).transfer(msg.value);
                    } else if (
                        keccak256(abi.encodePacked(_fundZone)) ==
                        keccak256(abi.encodePacked("Chittagong North"))
                    ) {
                        payable(chittagongNorthCollector).transfer(msg.value);
                    } else {
                        revert ERROR__INVALID__FUND__ZONE();
                    }
                } else {
                    revert ERROR__NOT__ENOUGH__BALANCE();
                }
            } else {
                revert ERROR__NOT__ENOUGH__SENT__VALUE();
            }
        } else {
            revert ERROR__Donor__Not__Registered();
        }
    }

    function getDonor(
        address _add
    ) public view returns (string memory, string memory) {
        return (donorsAddress[_add].name, donorsAddress[_add].mobileNum);
    }

    function getDonationAmountSylhet() public view returns (uint256) {
        return (sylhetCollector.balance - sylhetCollectorBalance_initial);
    }

    function getDonationAmountChittagongSouth() public view returns (uint256) {
        return (chittagongSouthCollector.balance - chittagongSouthCollectorBalance_initial);
    }

    function getDonationAmountChittagongNorth() public view returns (uint256) {
        return (chittagongNorthCollector.balance - chittagongNorthCollectorBalance_initial);
    }

    function getTotalDonation() public view returns (uint256) {
        return
            (sylhetCollector.balance +
            chittagongSouthCollector.balance +
            chittagongNorthCollector.balance -
            sylhetCollectorBalance_initial -
            chittagongSouthCollectorBalance_initial -
            chittagongNorthCollectorBalance_initial);
    }
}
